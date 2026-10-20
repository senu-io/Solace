import { SlashCommandBuilder } from "discord.js";
import type { Command, CommandContext } from "../../structures/Command.js";
import { SolaceEmbed } from "../../utils/embeds.js";

export const volumeCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Adjust the playback volume")
    .addIntegerOption((option) =>
      option
        .setName("level")
        .setDescription("Volume percentage (1 - 150)")
        .setMinValue(1)
        .setMaxValue(150)
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

    const level = interaction.options.getInteger("level", true);
    await player.setVolume(level);

    return interaction.reply({
      embeds: [
        SolaceEmbed.success(
          "Volume Updated",
          `Playback volume set to **${level}%**.`
        ),
      ],
    });
  },
};
