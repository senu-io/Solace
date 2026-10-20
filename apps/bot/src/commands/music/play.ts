import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import { db } from "@solace/database";
import type { Command, CommandContext } from "../../structures/Command.js";
import { SolaceEmbed } from "../../utils/embeds.js";
import { formatDuration } from "../../utils/formatters.js";

export const playCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a track or playlist from Spotify, YouTube Music, or SoundCloud")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Song title, Spotify/YouTube/SoundCloud URL, or search keywords")
        .setRequired(true)
    ),
  category: "music",
  voiceChannelRequired: true,
  run: async ({ client, interaction }: CommandContext) => {
    await interaction.deferReply();

    const member = interaction.member as GuildMember;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      return interaction.editReply({
        embeds: [
          SolaceEmbed.error(
            "Voice Channel Required",
            "You must be connected to a voice channel to play music."
          ),
        ],
      });
    }

    const query = interaction.options.getString("query", true);

    // Get or create player
    let player = client.lavalink.getPlayer(interaction.guildId!);
    if (!player) {
      const guildConfig = await db.getGuildConfig(interaction.guildId!);
      player = client.lavalink.createPlayer({
        guildId: interaction.guildId!,
        voiceChannelId: voiceChannel.id,
        textChannelId: guildConfig.textChannelId || interaction.channelId,
        selfDeaf: true,
        volume: guildConfig.defaultVolume,
      });
    }

    if (!player.connected) {
      await player.connect();
    }

    const res = await player.search(
      {
        query,
      },
      interaction.user
    );

    if (!res || !res.tracks?.length) {
      return interaction.editReply({
        embeds: [
          SolaceEmbed.error(
            "No Results Found",
            `Could not find any tracks matching: \`${query}\``
          ),
        ],
      });
    }

    if (res.loadType === "playlist") {
      await player.queue.add(res.tracks);
      if (!player.playing) await player.play();

      return interaction.editReply({
        embeds: [
          SolaceEmbed.success(
            "Playlist Added to Queue",
            `Enqueued **${res.tracks.length}** tracks from **${res.playlist?.name || "Playlist"}**.`
          ),
        ],
      });
    }

    const track = res.tracks[0];
    await player.queue.add(track);

    if (!player.playing) {
      await player.play();
      return interaction.editReply({
        embeds: [
          SolaceEmbed.success(
            "Loading Track",
            `Starting playback for **[${track.info.title}](${track.info.uri})**`
          ),
        ],
      });
    }

    return interaction.editReply({
      embeds: [
        SolaceEmbed.info(
          "Added to Queue",
          `**[${track.info.title}](${track.info.uri})**\n` +
            `**Artist:** ${track.info.author}\n` +
            `**Duration:** \`${track.info.isStream ? "LIVE" : formatDuration(track.info.duration || 0)}\`\n` +
            `**Position in Queue:** #${player.queue.tracks.length}`
        ),
      ],
    });
  },
};
