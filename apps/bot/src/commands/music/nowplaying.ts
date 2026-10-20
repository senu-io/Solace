import { SlashCommandBuilder } from "discord.js";
import type { Command, CommandContext } from "../../structures/Command.js";
import { SolaceEmbed } from "../../utils/embeds.js";
import { createProgressBar, formatDuration } from "../../utils/formatters.js";
import { createPlayerButtons } from "../../utils/components.js";

export const nowplayingCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Display the current track and interactive playback status"),
  category: "music",
  run: async ({ client, interaction }: CommandContext) => {
    const player = client.lavalink.getPlayer(interaction.guildId!);
    if (!player || !player.queue.current) {
      return interaction.reply({
        embeds: [SolaceEmbed.error("Nothing Playing", "There is no track currently playing.")],
        ephemeral: true,
      });
    }

    const current = player.queue.current;
    const position = player.position || 0;
    const duration = current.info.duration || 0;
    const isLive = Boolean(current.info.isStream);

    const progressBar = isLive
      ? "🔴 LIVE STREAM"
      : `${createProgressBar(position, duration)} \`[${formatDuration(position)} / ${formatDuration(duration)}]\``;

    const loopMode = (player.repeatMode || "off").toUpperCase();
    const isLofi = Boolean(player.filterManager?.filters?.lowPass);
    const filterStatus = isLofi ? "Lofi" : "None";

    const embed = SolaceEmbed.info(
      "Now Playing",
      `[${current.info.title}](${current.info.uri})\n\n` +
        `**Artist:** ${current.info.author}\n` +
        `**Timeline:**\n${progressBar}\n\n` +
        `**Volume:** \`${player.volume}%\` • **Loop:** \`${loopMode}\` • **Filter:** \`${filterStatus}\`\n` +
        (current.requester
          ? `**Requested by:** <@${(current.requester as { id?: string }).id || current.requester}>`
          : "")
    );

    if (current.info.artworkUrl) {
      embed.setThumbnail(current.info.artworkUrl);
    }

    return interaction.reply({
      embeds: [embed],
      components: createPlayerButtons(player),
    });
  },
};
