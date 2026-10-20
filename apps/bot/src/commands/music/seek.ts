import { SlashCommandBuilder } from "discord.js";
import type { Command, CommandContext } from "../../structures/Command.js";
import { SolaceEmbed } from "../../utils/embeds.js";
import { formatDuration, parseDuration } from "../../utils/formatters.js";

export const seekCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("seek")
    .setDescription("Seek to a specific timestamp in the currently playing track")
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("Timestamp to seek to (e.g. 1:30, 90s, 02:45)")
        .setRequired(true)
    ),
  category: "music",
  voiceChannelRequired: true,
  run: async ({ client, interaction }: CommandContext) => {
    const player = client.lavalink.getPlayer(interaction.guildId!);
    if (!player || !player.queue.current) {
      return interaction.reply({
        embeds: [SolaceEmbed.error("Nothing Playing", "There is no track currently playing.")],
        ephemeral: true,
      });
    }

    const current = player.queue.current;
    if (current.info.isStream) {
      return interaction.reply({
        embeds: [SolaceEmbed.error("Seek Unsupported", "Cannot seek within a live stream.")],
        ephemeral: true,
      });
    }

    const rawTime = interaction.options.getString("time", true);
    const targetMs = parseDuration(rawTime);

    if (targetMs === null) {
      return interaction.reply({
        embeds: [
          SolaceEmbed.error(
            "Invalid Format",
            "Please provide a valid time format, such as `1:30`, `90s`, or `02:15`."
          ),
        ],
        ephemeral: true,
      });
    }

    const duration = current.info.duration || 0;
    if (targetMs > duration) {
      return interaction.reply({
        embeds: [
          SolaceEmbed.error(
            "Out of Bounds",
            `Timestamp exceeds track length of \`${formatDuration(duration)}\`.`
          ),
        ],
        ephemeral: true,
      });
    }

    await player.seek(targetMs);

    return interaction.reply({
      embeds: [
        SolaceEmbed.success(
          "Seek Successful",
          `Jumped to **${formatDuration(targetMs)}** in **${current.info.title}**.`
        ),
      ],
    });
  },
};
