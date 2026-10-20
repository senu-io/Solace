import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import type { Player } from "lavalink-client";

export function createPlayerButtons(player: Player): ActionRowBuilder<ButtonBuilder>[] {
  const isPaused = player.paused;
  const loopMode = player.repeatMode || "off";

  const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("solace_pause_resume")
      .setLabel(isPaused ? "Resume" : "Pause")
      .setEmoji(isPaused ? "▶️" : "⏸️")
      .setStyle(isPaused ? ButtonStyle.Success : ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("solace_skip")
      .setLabel("Skip")
      .setEmoji("⏭️")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("solace_shuffle")
      .setLabel("Shuffle")
      .setEmoji("🔀")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("solace_loop")
      .setLabel(`Loop: ${loopMode.toUpperCase()}`)
      .setEmoji("🔁")
      .setStyle(loopMode !== "off" ? ButtonStyle.Primary : ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("solace_stop")
      .setLabel("Stop")
      .setEmoji("⏹️")
      .setStyle(ButtonStyle.Danger)
  );

  const isLofi = Boolean(player.filterManager?.filters?.lowPass);

  const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("solace_vol_down")
      .setLabel("-10%")
      .setEmoji("🔉")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("solace_vol_up")
      .setLabel("+10%")
      .setEmoji("🔊")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("solace_lofi")
      .setLabel(isLofi ? "Lofi: ON" : "Lofi: OFF")
      .setEmoji("☕")
      .setStyle(isLofi ? ButtonStyle.Primary : ButtonStyle.Secondary)
  );

  return [row1, row2];
}
