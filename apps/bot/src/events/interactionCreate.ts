import type { Interaction } from "discord.js";
import type { SolaceClient } from "../client/SolaceClient.js";
import { SolaceEmbed } from "../utils/embeds.js";

export async function handleInteraction(client: SolaceClient, interaction: Interaction): Promise<void> {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  // Voice channel precondition checks
  if (command.voiceChannelRequired) {
    const member = interaction.guild?.members.cache.get(interaction.user.id);
    if (!member?.voice.channelId) {
      await interaction.reply({
        embeds: [
          SolaceEmbed.error(
            "Voice Channel Required",
            "You must join a voice channel before using this command."
          ),
        ],
        ephemeral: true,
      });
      return;
    }
  }

  try {
    await command.run({ client, interaction });
  } catch (error) {
    console.error(`[Command Error] Error in /${interaction.commandName}:`, error);
    const replyEmbed = SolaceEmbed.error(
      "Execution Error",
      "An unexpected error occurred while executing this command."
    );

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ embeds: [replyEmbed] }).catch(() => null);
    } else {
      await interaction.reply({ embeds: [replyEmbed], ephemeral: true }).catch(() => null);
    }
  }
}
