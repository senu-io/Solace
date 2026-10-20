import {
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import { db } from "@solace/database";
import type { Command, CommandContext } from "../../structures/Command.js";
import { SolaceEmbed } from "../../utils/embeds.js";
import { formatDuration } from "../../utils/formatters.js";

export const playlistCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("playlist")
    .setDescription("Manage and load your saved personal playlists")
    .addSubcommand((sub) =>
      sub
        .setName("create")
        .setDescription("Create a new playlist")
        .addStringOption((opt) =>
          opt
            .setName("name")
            .setDescription("Unique name for the playlist")
            .setRequired(true)
        )
        .addBooleanOption((opt) =>
          opt
            .setName("public")
            .setDescription("Whether others can see/load this playlist")
            .setRequired(false)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("add")
        .setDescription("Add a song to your playlist")
        .addStringOption((opt) =>
          opt
            .setName("name")
            .setDescription("Name of your playlist")
            .setRequired(true)
        )
        .addStringOption((opt) =>
          opt
            .setName("query")
            .setDescription("Song name or URL (leave empty to add current playing track)")
            .setRequired(false)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("load")
        .setDescription("Load and play a saved playlist in your voice channel")
        .addStringOption((opt) =>
          opt
            .setName("name")
            .setDescription("Name of the playlist to load")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub.setName("list").setDescription("List all your saved playlists")
    )
    .addSubcommand((sub) =>
      sub
        .setName("view")
        .setDescription("View the tracks inside a playlist")
        .addStringOption((opt) =>
          opt
            .setName("name")
            .setDescription("Name of the playlist")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("delete")
        .setDescription("Delete a saved playlist")
        .addStringOption((opt) =>
          opt
            .setName("name")
            .setDescription("Name of the playlist to delete")
            .setRequired(true)
        )
    ),
  category: "music",
  run: async ({ client, interaction }: CommandContext) => {
    const subcommand = interaction.options.getSubcommand();
    const userId = interaction.user.id;

    // 1. Create Playlist
    if (subcommand === "create") {
      const name = interaction.options.getString("name", true).trim();
      const isPublic = interaction.options.getBoolean("public") ?? false;

      try {
        await db.createPlaylist(userId, name, isPublic);
        return interaction.reply({
          embeds: [
            SolaceEmbed.success(
              "Playlist Created",
              `Created playlist **${name}** (${isPublic ? "Public" : "Private"}).\n` +
                `Use \`/playlist add ${name}\` to save songs to it!`
            ),
          ],
        });
      } catch (err: unknown) {
        return interaction.reply({
          embeds: [
            SolaceEmbed.error(
              "Creation Failed",
              err instanceof Error ? err.message : "A playlist with that name already exists."
            ),
          ],
          ephemeral: true,
        });
      }
    }

    // 2. List Playlists
    if (subcommand === "list") {
      const playlists = await db.getUserPlaylists(userId);
      if (!playlists.length) {
        return interaction.reply({
          embeds: [
            SolaceEmbed.info(
              "No Playlists",
              "You don't have any saved playlists yet. Use `/playlist create <name>` to get started!"
            ),
          ],
          ephemeral: true,
        });
      }

      const listDesc = playlists
        .map(
          (p, i) =>
            `\`${i + 1}.\` **${p.name}** — ${p.tracks.length} tracks (${p.isPublic ? "Public" : "Private"})`
        )
        .join("\n");

      return interaction.reply({
        embeds: [SolaceEmbed.info(`${interaction.user.username}'s Playlists`, listDesc)],
      });
    }

    // 3. View Playlist Tracks
    if (subcommand === "view") {
      const name = interaction.options.getString("name", true).trim();
      const playlist = await db.getPlaylist(userId, name);

      if (!playlist) {
        return interaction.reply({
          embeds: [SolaceEmbed.error("Not Found", `Could not find playlist **${name}**.`)],
          ephemeral: true,
        });
      }

        if (!playlist.tracks.length) {
          return interaction.reply({
            embeds: [
              SolaceEmbed.info(
                `Playlist: ${playlist.name}`,
                "_This playlist is currently empty._"
              ),
            ],
          });
        }

        const trackList = playlist.tracks
          .slice(0, 20)
          .map(
            (t, i) =>
              `\`${i + 1}.\` [${t.title}](${t.uri}) — \`${formatDuration(t.duration)}\``
          )
          .join("\n");

        const footerExtra =
          playlist.tracks.length > 20
            ? `\n\n_...and ${playlist.tracks.length - 20} more tracks._`
            : "";

        return interaction.reply({
          embeds: [
            SolaceEmbed.info(
              `Playlist: ${playlist.name} (${playlist.tracks.length} tracks)`,
              trackList + footerExtra
            ),
          ],
        });
      }

    // 4. Add Song to Playlist
    if (subcommand === "add") {
      const name = interaction.options.getString("name", true).trim();
      const query = interaction.options.getString("query");

      const playlist = await db.getPlaylist(userId, name);
      if (!playlist) {
        return interaction.reply({
          embeds: [SolaceEmbed.error("Not Found", `Could not find playlist **${name}**.`)],
          ephemeral: true,
        });
      }

      let trackToAdd = null;

      if (!query) {
        const player = client.lavalink.getPlayer(interaction.guildId!);
        if (!player || !player.queue.current) {
          return interaction.reply({
            embeds: [
              SolaceEmbed.error(
                "No Song",
                "No track is currently playing. Please provide a `query` to search and add."
              ),
            ],
            ephemeral: true,
          });
        }
        const current = player.queue.current;
        trackToAdd = {
          title: current.info.title,
          author: current.info.author,
          uri: current.info.uri || "https://discord.gg",
          duration: current.info.duration || 0,
          artworkUrl: current.info.artworkUrl,
        };
      } else {
        await interaction.deferReply();
        const node = client.lavalink.nodeManager.nodes.values().next().value;
        if (!node) {
          return interaction.editReply({
            embeds: [SolaceEmbed.error("Node Offline", "Lavalink audio node is not connected.")],
          });
        }
        const res = await node.search(
          {
            query,
            source: "ytmsearch",
          },
          interaction.user
        );

        if (!res?.tracks?.length) {
          return interaction.editReply({
            embeds: [SolaceEmbed.error("No Match", `Could not find any songs matching \`${query}\`.`)],
          });
        }

        const found = res.tracks[0];
        trackToAdd = {
          title: found.info.title,
          author: found.info.author,
          uri: found.info.uri || "https://discord.gg",
          duration: found.info.duration || 0,
          artworkUrl: found.info.artworkUrl,
        };
      }

      await db.addTrackToPlaylist(userId, name, trackToAdd);

      const responseEmbed = SolaceEmbed.success(
        "Track Added",
        `Added **[${trackToAdd.title}](${trackToAdd.uri})** to playlist **${name}**.`
      );

      if (interaction.deferred) {
        return interaction.editReply({ embeds: [responseEmbed] });
      }
      return interaction.reply({ embeds: [responseEmbed] });
    }

    // 5. Delete Playlist
    if (subcommand === "delete") {
      const name = interaction.options.getString("name", true).trim();
      const deleted = await db.deletePlaylist(userId, name);

      if (!deleted) {
        return interaction.reply({
          embeds: [SolaceEmbed.error("Not Found", `Could not find playlist **${name}** to delete.`)],
          ephemeral: true,
        });
      }

      return interaction.reply({
        embeds: [SolaceEmbed.success("Playlist Deleted", `Successfully removed **${name}**.`)],
      });
    }

    // 6. Load Playlist into Voice Channel
    if (subcommand === "load") {
      const member = interaction.member as GuildMember;
      const voiceChannel = member.voice.channel;

      if (!voiceChannel) {
        return interaction.reply({
          embeds: [
            SolaceEmbed.error(
              "Voice Channel Required",
              "You must join a voice channel before loading a playlist."
            ),
          ],
          ephemeral: true,
        });
      }

      const name = interaction.options.getString("name", true).trim();
      const playlist = await db.getPlaylist(userId, name);

      if (!playlist) {
        return interaction.reply({
          embeds: [SolaceEmbed.error("Not Found", `Could not find playlist **${name}**.`)],
          ephemeral: true,
        });
      }

      if (!playlist.tracks.length) {
        return interaction.reply({
          embeds: [
            SolaceEmbed.error(
              "Empty Playlist",
              `Playlist **${name}** has no tracks saved. Add some tracks first!`
            ),
          ],
          ephemeral: true,
        });
      }

      await interaction.deferReply();

      let player = client.lavalink.getPlayer(interaction.guildId!);
      if (!player) {
        player = client.lavalink.createPlayer({
          guildId: interaction.guildId!,
          voiceChannelId: voiceChannel.id,
          textChannelId: interaction.channelId,
          selfDeaf: true,
          volume: 80,
        });
      }

      if (!player.connected) {
        await player.connect();
      }

      let enqueuedCount = 0;
      for (const track of playlist.tracks) {
        const res = await player.search({ query: track.uri }, interaction.user);
        if (res?.tracks?.length) {
          await player.queue.add(res.tracks[0]);
          enqueuedCount++;
        }
      }

      if (!player.playing) {
        await player.play();
      }

      return interaction.editReply({
        embeds: [
          SolaceEmbed.success(
            "Playlist Enqueued",
            `Loaded **${enqueuedCount}** tracks from **${playlist.name}** into the queue.`
          ),
        ],
      });
    }
  },
};
