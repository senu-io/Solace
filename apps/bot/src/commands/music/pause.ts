import { SlashCommandBuilder } from "discord.js";
import type { Command, CommandContext } from "../../structures/Command.js";
import { SolaceEmbed } from "../../utils/embeds.js";

export const pauseCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pause the current playback"),
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

    if (player.paused) {
      return interaction.reply({
        embeds: [SolaceEmbed.error("Already Paused", "Playback is already paused. Use `/resume` instead.")],
        ephemeral: true,
      });
    }

    await player.pause();
    return interaction.reply({
      embeds: [SolaceEmbed.success("Playback Paused", "Paused the music. Use `/resume` to continue.")],
    });
  },
};
