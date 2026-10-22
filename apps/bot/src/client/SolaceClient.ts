import {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  type TextChannel,
} from "discord.js";
import {
  LavalinkManager,
  type Player,
  type Track,
} from "lavalink-client";
import { blue, green, red, yellow } from "colorette";
import { db } from "@solace/database";
import { config } from "../config.js";
import type { Command } from "../structures/Command.js";
import { SolaceEmbed } from "../utils/embeds.js";
import { formatDuration } from "../utils/formatters.js";
import { createPlayerButtons } from "../utils/components.js";

export class SolaceClient extends Client {
  public commands: Collection<string, Command> = new Collection();
  public lavalink!: LavalinkManager;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
      ],
      partials: [Partials.Channel, Partials.GuildMember, Partials.User],
    });

    this.initLavalink();
    this.registerDiscordEvents();
  }

  private initLavalink(): void {
    const [host, portStr] = config.lavalink.url.split(":");
    const port = Number.parseInt(portStr || "2333", 10);

    this.lavalink = new LavalinkManager({
      nodes: [
        {
          authorization: config.lavalink.auth,
          host: host || "localhost",
          port: port || 2333,
          id: config.lavalink.name,
          secure: config.lavalink.secure,
        },
      ],
      sendToShard: (guildId, payload) => {
        const guild = this.guilds.cache.get(guildId);
        if (guild) guild.shard.send(payload);
      },
      client: {
        id: config.clientId || "1562745565140492298",
        username: "Solace",
      },
      autoSkip: true,
      playerOptions: {
        defaultSearchPlatform: "ytmsearch",
        onDisconnect: {
          autoReconnect: true,
          destroyPlayer: false,
        },
      },
      queueOptions: {
        maxPreviousTracks: 25,
      },
    });

    this.registerLavalinkEvents();
  }

  private registerDiscordEvents(): void {
    // Forward raw Discord voice packets to LavalinkManager
    this.on("raw", (packet) => {
      this.lavalink.sendRawData(packet);
    });

    this.once("ready", async () => {
      console.log(green(`[Discord] Logged in as ${this.user?.tag} (${this.user?.id})`));
      if (this.user) {
        await this.lavalink.init({
          id: this.user.id,
          username: this.user.username,
        });
      }
    });
  }

  private registerLavalinkEvents(): void {
    // Node connection events
    this.lavalink.nodeManager.on("connect", async (node) => {
      console.log(green(`[Lavalink] Node "${node.id}" connected successfully.`));

      // Restore 24/7 channels across servers
      for (const guild of this.guilds.cache.values()) {
        try {
          const guildConfig = await db.getGuildConfig(guild.id);
          if (guildConfig.twentyFourSeven && guildConfig.voiceChannelId) {
            let player = this.lavalink.getPlayer(guild.id);
            if (!player) {
              player = this.lavalink.createPlayer({
                guildId: guild.id,
                voiceChannelId: guildConfig.voiceChannelId,
                textChannelId: guildConfig.textChannelId || undefined,
                selfDeaf: true,
                volume: guildConfig.defaultVolume,
              });
            }
            if (!player.connected) {
              await player.connect();
              console.log(blue(`[24/7] Connected to persistent voice channel in guild: ${guild.name}`));
            }
          }
        } catch (err) {
          console.warn(`[24/7] Failed to restore connection for guild ${guild.id}:`, err);
        }
      }
    });

    this.lavalink.nodeManager.on("disconnect", (node, reason) => {
      console.warn(yellow(`[Lavalink] Node "${node.id}" disconnected: ${JSON.stringify(reason)}`));
    });

    this.lavalink.nodeManager.on("error", (node, error) => {
      console.error(red(`[Lavalink] Node "${node.id}" error:`), error);
    });

    // Track playback events
    this.lavalink.on("trackStart", (player: Player, track: Track | null) => {
      if (!track || !player.textChannelId) return;
      const channel = this.channels.cache.get(player.textChannelId) as TextChannel | undefined;
      if (!channel) return;

      const title = track.info?.title || "Unknown Title";
      const uri = track.info?.uri || "https://discord.gg";
      const author = track.info?.author || "Unknown Artist";
      const duration = track.info?.isStream
        ? "LIVE"
        : formatDuration(track.info?.duration || 0);

      const embed = SolaceEmbed.info(
        "Now Playing",
        `[${title}](${uri})\n\n` +
          `**Artist:** ${author}\n` +
          `**Duration:** \`${duration}\`\n` +
          (track.requester ? `**Requested by:** <@${(track.requester as { id?: string }).id || track.requester}>` : "")
      );

      if (track.info?.artworkUrl) {
        embed.setThumbnail(track.info.artworkUrl);
      }

      channel
        .send({
          embeds: [embed],
          components: createPlayerButtons(player),
        })
        .catch(() => null);
    });

    this.lavalink.on("queueEnd", (player: Player) => {
      if (!player.textChannelId) return;
      const channel = this.channels.cache.get(player.textChannelId) as TextChannel | undefined;
      if (channel) {
        channel
          .send({
            embeds: [
              SolaceEmbed.info(
                "Queue Finished",
                "The queue has concluded. Use `/play` to play more tunes!"
              ),
            ],
          })
          .catch(() => null);
      }
    });

    this.lavalink.on("trackError", (player: Player, track: unknown, payload: unknown) => {
      console.error(red(`[Track Error] In guild ${player.guildId}:`), payload);
      if (!player.textChannelId) return;
      const channel = this.channels.cache.get(player.textChannelId) as TextChannel | undefined;
      if (channel) {
        channel
          .send({
            embeds: [
              SolaceEmbed.error(
                "Playback Error",
                "Failed to play the requested track. Skipping to the next track."
              ),
            ],
          })
          .catch(() => null);
      }
    });
  }

  public async start(): Promise<void> {
    if (!config.token) {
      console.warn(yellow("[Warning] DISCORD_TOKEN is not configured in .env yet."));
      return;
    }
    await this.login(config.token);
  }
}
