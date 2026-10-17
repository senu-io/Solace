import { SlashCommandBuilder } from "discord.js";
import type { Command, CommandContext } from "../../structures/Command.js";
import { SolaceEmbed } from "../../utils/embeds.js";

export const pingCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check bot latency and Lavalink audio node status"),
  category: "utility",
  run: async ({ client, interaction }: CommandContext) => {
    const wsPing = client.ws.ping;
    const nodes = client.lavalink.nodeManager.nodes;
    const primaryNode = nodes.values().next().value;

    const nodeStatus = primaryNode
      ? `${primaryNode.stats?.players || 0} players | Ping: ${primaryNode.stats?.frameStats?.sent ? "Stable" : "Ready"}`
      : "Not Connected";

    const embed = SolaceEmbed.info(
      "Solace Diagnostic Latency",
      `📡 **Discord Gateway:** \`${wsPing}ms\`\n` +
      `🔊 **Lavalink Node:** \`${nodeStatus}\``
    );

    return interaction.reply({ embeds: [embed] });
  },
};
