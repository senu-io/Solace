import type { ButtonInteraction, Interaction } from "discord.js";
import type { SolaceClient } from "../client/SolaceClient.js";
import { SolaceEmbed } from "../utils/embeds.js";
import { createPlayerButtons } from "../utils/components.js";

export async function handleInteraction(
  client: SolaceClient,
  interaction: Interaction
): Promise<void> {
  // Handle Slash Commands
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

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
    return;
  }

  // Handle Interactive Buttons
  if (interaction.isButton()) {
    await handleButtonInteraction(client, interaction);
  }
}

async function handleButtonInteraction(
  client: SolaceClient,
  interaction: ButtonInteraction
): Promise<void> {
  if (!interaction.customId.startsWith("solace_")) return;

  const player = client.lavalink.getPlayer(interaction.guildId!);
  if (!player || !player.queue.current) {
    await interaction.reply({
      embeds: [SolaceEmbed.error("Not Active", "No active playback session in this server.")],
      ephemeral: true,
    });
    return;
  }

  const member = interaction.guild?.members.cache.get(interaction.user.id);
  if (!member?.voice.channelId || member.voice.channelId !== player.voiceChannelId) {
    await interaction.reply({
      embeds: [
        SolaceEmbed.error(
          "Voice Channel Mismatch",
          "You must be in the same voice channel as Solace to use playback controls."
        ),
      ],
      ephemeral: true,
    });
    return;
  }

  switch (interaction.customId) {
    case "solace_pause_resume": {
      if (player.paused) {
        await player.resume();
      } else {
        await player.pause();
      }
      await interaction.update({ components: createPlayerButtons(player) });
      break;
    }

    case "solace_skip": {
      await player.skip();
      await interaction.reply({
        embeds: [SolaceEmbed.success("Track Skipped", "Skipped to the next track.")],
        ephemeral: true,
      });
      break;
    }

    case "solace_shuffle": {
      player.queue.shuffle();
      await interaction.reply({
        embeds: [SolaceEmbed.success("Queue Shuffled", `Shuffled ${player.queue.tracks.length} tracks.`)],
        ephemeral: true,
      });
      break;
    }

    case "solace_loop": {
      const currentMode = player.repeatMode || "off";
      const nextMode =
        currentMode === "off" ? "track" : currentMode === "track" ? "queue" : "off";

      await player.setRepeatMode(nextMode);
      await interaction.update({ components: createPlayerButtons(player) });
      break;
    }

    case "solace_stop": {
      await player.destroy();
      await interaction.update({
        components: [],
      });
      await interaction.followUp({
        embeds: [SolaceEmbed.info("Stopped", "Playback stopped and queue cleared by user.")],
      });
      break;
    }

    case "solace_vol_down": {
      const newVol = Math.max(10, player.volume - 10);
      await player.setVolume(newVol);
      await interaction.reply({
        embeds: [SolaceEmbed.info("Volume Adjusted", `Volume set to **${newVol}%**`)],
        ephemeral: true,
      });
      break;
    }

    case "solace_vol_up": {
      const newVol = Math.min(150, player.volume + 10);
      await player.setVolume(newVol);
      await interaction.reply({
        embeds: [SolaceEmbed.info("Volume Adjusted", `Volume set to **${newVol}%**`)],
        ephemeral: true,
      });
      break;
    }

    case "solace_lofi": {
      const isLofi = Boolean(player.filterManager?.filters?.lowPass);
      if (isLofi) {
        await player.filterManager.resetFilters();
      } else {
        await player.filterManager.toggleLowPass(25);
      }
      await interaction.update({ components: createPlayerButtons(player) });
      break;
    }

    default:
      break;
  }
}
