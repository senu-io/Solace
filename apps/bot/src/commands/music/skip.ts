import { SlashCommandBuilder } from "discord.js";
import type { Command, CommandContext } from "../../structures/Command.js";
import { SolaceEmbed } from "../../utils/embeds.js";

export const skipCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip the currently playing track"),
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

    const skippedTrack = player.queue.current;
    await player.skip();

    return interaction.reply({
      embeds: [
        SolaceEmbed.success(
          "Track Skipped",
          `Skipped **[${skippedTrack.info.title}](${skippedTrack.info.uri})**`
        ),
      ],
    });
  },
};
