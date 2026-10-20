import { SlashCommandBuilder } from "discord.js";
import type { Command, CommandContext } from "../../structures/Command.js";
import { SolaceEmbed } from "../../utils/embeds.js";

export const previousCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("previous")
    .setDescription("Play the previous track from history"),
  category: "music",
  voiceChannelRequired: true,
  run: async ({ client, interaction }: CommandContext) => {
    const player = client.lavalink.getPlayer(interaction.guildId!);
    if (!player) {
      return interaction.reply({
        embeds: [SolaceEmbed.error("Nothing Playing", "No active playback session in this server.")],
        ephemeral: true,
      });
    }

    const previousTrack = player.queue.previous?.[0];
    if (!previousTrack) {
      return interaction.reply({
        embeds: [
          SolaceEmbed.error(
            "No Previous Track",
            "There are no previous tracks stored in session history."
          ),
        ],
        ephemeral: true,
      });
    }

    // Insert the previous track at the top of the queue and skip to it
    player.queue.tracks.unshift(previousTrack);
    await player.skip();

    return interaction.reply({
      embeds: [
        SolaceEmbed.success(
          "Playing Previous Track",
          `Replaying **[${previousTrack.info.title}](${previousTrack.info.uri})**.`
        ),
      ],
    });
  },
};
