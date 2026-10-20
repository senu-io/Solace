import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import type { Command, CommandContext } from "../../structures/Command.js";
import { SolaceEmbed } from "../../utils/embeds.js";

const RADIO_STATIONS: Record<string, { name: string; url: string }> = {
  lofi: {
    name: "Lofi Girl (Chill / Study Beats)",
    url: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
  },
  synthwave: {
    name: "Lofi Girl (Synthwave / Chillwave)",
    url: "https://www.youtube.com/watch?v=4xDzrJKXOOY",
  },
  jazz: {
    name: "Coffee Shop Relaxing Jazz",
    url: "https://www.youtube.com/watch?v=Dx5qFachd3A",
  },
  classical: {
    name: "Classical Music for Reading & Focus",
    url: "https://www.youtube.com/watch?v=mIYzp5rcTvU",
  },
};

export const radioCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("radio")
    .setDescription("Start a continuous 24/7 live radio stream in your voice channel")
    .addStringOption((option) =>
      option
        .setName("station")
        .setDescription("Select a curated radio stream station")
        .setRequired(true)
        .addChoices(
          { name: "Lofi Girl (Chill / Study)", value: "lofi" },
          { name: "Synthwave / Chillwave", value: "synthwave" },
          { name: "Coffee Shop Smooth Jazz", value: "jazz" },
          { name: "Focus Classical", value: "classical" }
        )
    ),
  category: "music",
  voiceChannelRequired: true,
  run: async ({ client, interaction }: CommandContext) => {
    await interaction.deferReply();

    const member = interaction.member as GuildMember;
    const voiceChannel = member.voice.channel;
    if (!voiceChannel) {
      return interaction.editReply({
        embeds: [SolaceEmbed.error("Voice Channel Required", "You must join a voice channel.")],
      });
    }

    const stationKey = interaction.options.getString("station", true);
    const station = RADIO_STATIONS[stationKey];
    if (!station) {
      return interaction.editReply({
        embeds: [SolaceEmbed.error("Station Not Found", "The specified radio station does not exist.")],
      });
    }

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

    const res = await player.search(
      {
        query: station.url,
      },
      interaction.user
    );

    if (!res || !res.tracks?.length) {
      return interaction.editReply({
        embeds: [
          SolaceEmbed.error(
            "Stream Unavailable",
            `Could not resolve the live stream for **${station.name}** at this moment.`
          ),
        ],
      });
    }

    const track = res.tracks[0];
    // If playing, clear queue and play this radio station immediately
    player.queue.tracks.splice(0, player.queue.tracks.length);
    await player.queue.add(track);

    if (player.playing) {
      await player.skip();
    } else {
      await player.play();
    }

    return interaction.editReply({
      embeds: [
        SolaceEmbed.success(
          "Radio Station Activated",
          `Streaming **${station.name}** in <#${voiceChannel.id}>.\n` +
            `Use \`/filter\` to customize acoustics or \`/stop\` to disconnect.`
        ),
      ],
    });
  },
};
