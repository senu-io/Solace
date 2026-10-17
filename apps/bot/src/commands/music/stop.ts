import { SlashCommandBuilder } from "discord.js";
import type { Command, CommandContext } from "../../structures/Command.js";
import { SolaceEmbed } from "../../utils/embeds.js";

export const stopCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop playback, clear the queue, and disconnect from the voice channel"),
  category: "music",
  voiceChannelRequired: true,
  run: async ({ client, interaction }: CommandContext) => {
    const player = client.lavalink.getPlayer(interaction.guildId!);
    if (!player) {
      return interaction.reply({
        embeds: [SolaceEmbed.error("Not Connected", "Solace is not active in this server.")],
        ephemeral: true,
      });
    }

    await player.destroy();
    return interaction.reply({
      embeds: [
        SolaceEmbed.success(
          "Playback Stopped",
          "Cleared the music queue and disconnected from the voice channel."
        ),
      ],
    });
  },
};
