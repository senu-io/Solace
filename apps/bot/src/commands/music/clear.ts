import { SlashCommandBuilder } from "discord.js";
import type { Command, CommandContext } from "../../structures/Command.js";
import { SolaceEmbed } from "../../utils/embeds.js";

export const clearCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear all upcoming tracks from the queue without stopping current playback"),
  category: "music",
  voiceChannelRequired: true,
  run: async ({ client, interaction }: CommandContext) => {
    const player = client.lavalink.getPlayer(interaction.guildId!);
    if (!player || !player.queue.tracks.length) {
      return interaction.reply({
        embeds: [SolaceEmbed.error("Queue Empty", "There are no upcoming tracks in the queue to clear.")],
        ephemeral: true,
      });
    }

    const count = player.queue.tracks.length;
    player.queue.tracks.splice(0, count);

    return interaction.reply({
      embeds: [
        SolaceEmbed.success(
          "Queue Cleared",
          `Removed **${count}** upcoming tracks from the queue.`
        ),
      ],
    });
  },
};
