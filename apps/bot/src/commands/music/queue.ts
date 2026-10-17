import { SlashCommandBuilder } from "discord.js";
import type { Command, CommandContext } from "../../structures/Command.js";
import { SolaceEmbed } from "../../utils/embeds.js";
import { formatDuration } from "../../utils/formatters.js";

export const queueCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Display the current playback queue")
    .addIntegerOption((opt) =>
      opt.setName("page").setDescription("Page number").setMinValue(1)
    ),
  category: "music",
  run: async ({ client, interaction }: CommandContext) => {
    const player = client.lavalink.getPlayer(interaction.guildId!);
    if (!player || !player.queue.current) {
      return interaction.reply({
        embeds: [SolaceEmbed.error("Nothing Playing", "The queue is currently empty.")],
        ephemeral: true,
      });
    }

    const current = player.queue.current;
    const tracks = player.queue.tracks;
    const totalTracks = tracks.length;

    const page = (interaction.options.getInteger("page") || 1) - 1;
    const itemsPerPage = 10;
    const maxPages = Math.ceil(totalTracks / itemsPerPage) || 1;

    const pageTracks = tracks.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

    let queueString = `**Now Playing:**\n` +
      `🎶 [${current.info.title}](${current.info.uri}) - \`${formatDuration(current.info.duration)}\`\n\n` +
      `**Upcoming Tracks:**\n`;

    if (!pageTracks.length) {
      queueString += `_No upcoming tracks in queue._`;
    } else {
      queueString += pageTracks
        .map(
          (track, i) =>
            `\`${page * itemsPerPage + i + 1}.\` [${track.info.title}](${track.info.uri}) - \`${formatDuration(track.info.duration || 0)}\``
        )
        .join("\n");
    }

    const embed = SolaceEmbed.info(`Solace Queue — Page ${page + 1} of ${maxPages}`, queueString);
    embed.setFooter({
      text: `Total Queue Length: ${totalTracks} tracks`,
    });

    return interaction.reply({ embeds: [embed] });
  },
};
