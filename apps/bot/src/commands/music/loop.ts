import { SlashCommandBuilder } from "discord.js";
import type { Command, CommandContext } from "../../structures/Command.js";
import { SolaceEmbed } from "../../utils/embeds.js";

export const loopCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Configure repeat mode for playback")
    .addStringOption((option) =>
      option
        .setName("mode")
        .setDescription("Looping mode to apply")
        .setRequired(true)
        .addChoices(
          { name: "Disable (Off)", value: "off" },
          { name: "Single Track", value: "track" },
          { name: "Entire Queue", value: "queue" }
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

    const mode = interaction.options.getString("mode", true) as "off" | "track" | "queue";
    await player.setRepeatMode(mode);

    const modeDescriptions = {
      off: "Looping has been disabled.",
      track: "Now looping the current track.",
      queue: "Now looping the entire queue.",
    };

    return interaction.reply({
      embeds: [
        SolaceEmbed.success(
          `Repeat Mode: ${mode.toUpperCase()}`,
          modeDescriptions[mode]
        ),
      ],
    });
  },
};
