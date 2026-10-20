import { SlashCommandBuilder } from "discord.js";
import type { Command, CommandContext } from "../../structures/Command.js";
import { SolaceEmbed } from "../../utils/embeds.js";

export const removeCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove a specific track from the queue by its number")
    .addIntegerOption((option) =>
      option
        .setName("position")
        .setDescription("Queue position of the track to remove (1-based)")
        .setMinValue(1)
        .setRequired(true)
    ),
  category: "music",
  voiceChannelRequired: true,
  run: async ({ client, interaction }: CommandContext) => {
    const player = client.lavalink.getPlayer(interaction.guildId!);
    if (!player || !player.queue.tracks.length) {
      return interaction.reply({
        embeds: [SolaceEmbed.error("Queue Empty", "The queue is currently empty.")],
        ephemeral: true,
      });
    }

    const position = interaction.options.getInteger("position", true);
    if (position > player.queue.tracks.length) {
      return interaction.reply({
        embeds: [
          SolaceEmbed.error(
            "Invalid Position",
            `Position must be between 1 and ${player.queue.tracks.length}.`
          ),
        ],
        ephemeral: true,
      });
    }

    const [removed] = player.queue.tracks.splice(position - 1, 1);

    return interaction.reply({
      embeds: [
        SolaceEmbed.success(
          "Track Removed",
          `Removed **[${removed.info.title}](${removed.info.uri})** from queue position #${position}.`
        ),
      ],
    });
  },
};
