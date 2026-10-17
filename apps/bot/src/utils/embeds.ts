import { EmbedBuilder } from "discord.js";

export const SOLACE_COLORS = {
  PRIMARY: 0x6C5CE7,   // Modern Indigo / Soft Violet
  SUCCESS: 0x00B894,   // Emerald Green
  WARNING: 0xFDCB6E,   // Soft Amber
  ERROR: 0xD63031,     // Crimson Red
  DARK: 0x2D3436,      // Charcoal
};

export class SolaceEmbed extends EmbedBuilder {
  constructor() {
    super();
    this.setColor(SOLACE_COLORS.PRIMARY);
    this.setTimestamp();
  }

  static success(title: string, description?: string): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor(SOLACE_COLORS.SUCCESS)
      .setTitle(`✅ ${title}`)
      .setTimestamp();
    if (description) embed.setDescription(description);
    return embed;
  }

  static error(title: string, description?: string): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor(SOLACE_COLORS.ERROR)
      .setTitle(`❌ ${title}`)
      .setTimestamp();
    if (description) embed.setDescription(description);
    return embed;
  }

  static info(title: string, description?: string): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor(SOLACE_COLORS.PRIMARY)
      .setTitle(`🎵 ${title}`)
      .setTimestamp();
    if (description) embed.setDescription(description);
    return embed;
  }
}
