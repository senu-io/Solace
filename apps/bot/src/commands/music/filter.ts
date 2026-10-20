import { SlashCommandBuilder } from "discord.js";
import { EQList } from "lavalink-client";
import type { Command, CommandContext } from "../../structures/Command.js";
import { SolaceEmbed } from "../../utils/embeds.js";

export const filterCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("filter")
    .setDescription("Apply real-time audio DSP filters to the current playback")
    .addStringOption((option) =>
      option
        .setName("preset")
        .setDescription("Filter preset to apply")
        .setRequired(true)
        .addChoices(
          { name: "Reset / Clear All", value: "none" },
          { name: "Lofi Mode", value: "lofi" },
          { name: "Bass Boost", value: "bassboost" },
          { name: "Nightcore", value: "nightcore" },
          { name: "8D Audio (Rotating)", value: "8d" },
          { name: "Vaporwave", value: "vaporwave" }
        )
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

    const preset = interaction.options.getString("preset", true);
    await interaction.deferReply();

    // Reset current filters first
    await player.filterManager.resetFilters();

    switch (preset) {
      case "none":
        return interaction.editReply({
          embeds: [SolaceEmbed.success("Filters Cleared", "All audio DSP filters have been deactivated.")],
        });

      case "lofi":
        await player.filterManager.toggleLowPass(25);
        return interaction.editReply({
          embeds: [
            SolaceEmbed.success(
              "Lofi Mode Enabled",
              "Applied low-pass acoustic filtering for a chill, nostalgic listening experience."
            ),
          ],
        });

      case "bassboost":
        await player.filterManager.setEQ(EQList.BassboostHigh);
        return interaction.editReply({
          embeds: [
            SolaceEmbed.success(
              "Bass Boost Enabled",
              "Applied high-gain low-frequency equalizer curve."
            ),
          ],
        });

      case "nightcore":
        await player.filterManager.toggleNightcore();
        return interaction.editReply({
          embeds: [
            SolaceEmbed.success(
              "Nightcore Mode Enabled",
              "Increased playback speed and frequency pitch."
            ),
          ],
        });

      case "8d":
        await player.filterManager.toggleRotation(0.2);
        return interaction.editReply({
          embeds: [
            SolaceEmbed.success(
              "8D Audio Enabled",
              "Applied spatial 360-degree audio rotation."
            ),
          ],
        });

      case "vaporwave":
        await player.filterManager.toggleVaporwave();
        return interaction.editReply({
          embeds: [
            SolaceEmbed.success(
              "Vaporwave Enabled",
              "Slowed tempo and relaxed frequency response."
            ),
          ],
        });

      default:
        return interaction.editReply({
          embeds: [SolaceEmbed.error("Unknown Filter", "The specified filter preset is unrecognized.")],
        });
    }
  },
};
