import { SlashCommandBuilder } from "discord.js";
import type { Command, CommandContext } from "../../structures/Command.js";
import { SolaceEmbed } from "../../utils/embeds.js";

export const resumeCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resume the paused playback"),
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

    if (!player.paused) {
      return interaction.reply({
        embeds: [SolaceEmbed.error("Not Paused", "Playback is not paused.")],
        ephemeral: true,
      });
    }

    await player.resume();
    return interaction.reply({
      embeds: [SolaceEmbed.success("Playback Resumed", "Resumed music playback.")],
    });
  },
};
