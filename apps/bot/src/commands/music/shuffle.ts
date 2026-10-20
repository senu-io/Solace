import { SlashCommandBuilder } from "discord.js";
import type { Command, CommandContext } from "../../structures/Command.js";
import { SolaceEmbed } from "../../utils/embeds.js";

export const shuffleCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Randomize the order of tracks in the queue"),
  category: "music",
  voiceChannelRequired: true,
  run: async ({ client, interaction }: CommandContext) => {
    const player = client.lavalink.getPlayer(interaction.guildId!);
    if (!player || !player.queue.tracks.length) {
      return interaction.reply({
        embeds: [SolaceEmbed.error("Queue Empty", "There are not enough tracks in the queue to shuffle.")],
        ephemeral: true,
      });
    }

    if (player.queue.tracks.length < 2) {
      return interaction.reply({
        embeds: [SolaceEmbed.error("Too Few Tracks", "Need at least 2 tracks in the queue to shuffle.")],
        ephemeral: true,
      });
    }

    player.queue.shuffle();

    return interaction.reply({
      embeds: [
        SolaceEmbed.success(
          "Queue Shuffled",
          `Successfully shuffled **${player.queue.tracks.length}** tracks.`
        ),
      ],
    });
  },
};
