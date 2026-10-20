import {
  ChannelType,
  SlashCommandBuilder,
} from "discord.js";
import { PermissionLevel } from "@solace/shared";
import { db } from "@solace/database";
import type { Command, CommandContext } from "../../structures/Command.js";
import { SolaceEmbed } from "../../utils/embeds.js";

export const settingsCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("settings")
    .setDescription("View or modify Solace server configuration")
    .addSubcommand((sub) =>
      sub.setName("view").setDescription("View current server settings")
    )
    .addSubcommand((sub) =>
      sub
        .setName("dj")
        .setDescription("Assign or clear the designated DJ role")
        .addRoleOption((opt) =>
          opt
            .setName("role")
            .setDescription("The DJ role to assign (leave empty to remove)")
            .setRequired(false)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("volume")
        .setDescription("Set the default starting volume for playback")
        .addIntegerOption((opt) =>
          opt
            .setName("level")
            .setDescription("Default volume level (10 - 150)")
            .setMinValue(10)
            .setMaxValue(150)
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("channel")
        .setDescription("Lock commands to a text channel or bind a voice channel")
        .addStringOption((opt) =>
          opt
            .setName("type")
            .setDescription("Channel type to configure")
            .setRequired(true)
            .addChoices(
              { name: "Command Text Channel", value: "text" },
              { name: "24/7 Voice Channel", value: "voice" }
            )
        )
        .addChannelOption((opt) =>
          opt
            .setName("channel")
            .setDescription("Channel to bind (leave empty to unbind)")
            .setRequired(false)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("247")
        .setDescription("Toggle 24/7 voice channel presence")
        .addBooleanOption((opt) =>
          opt
            .setName("enabled")
            .setDescription("Enable or disable 24/7 mode")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("voteskip")
        .setDescription("Configure vote-skip behavior")
        .addBooleanOption((opt) =>
          opt
            .setName("enabled")
            .setDescription("Enable or disable vote skipping")
            .setRequired(true)
        )
        .addNumberOption((opt) =>
          opt
            .setName("ratio")
            .setDescription("Percentage of listeners required (e.g. 0.5 for 50%)")
            .setMinValue(0.1)
            .setMaxValue(1.0)
            .setRequired(false)
        )
    ),
  category: "settings",
  requiredPermission: PermissionLevel.SERVER_ADMIN,
  run: async ({ client, interaction }: CommandContext) => {
    if (!interaction.guildId) return;

    const subcommand = interaction.options.getSubcommand();
    const currentConfig = await db.getGuildConfig(interaction.guildId);

    // 1. View settings
    if (subcommand === "view") {
      const djRoleDisplay = currentConfig.djRoleId
        ? `<@&${currentConfig.djRoleId}>`
        : "None (Requires Administrator / DJ named role)";
      const textChannelDisplay = currentConfig.textChannelId
        ? `<#${currentConfig.textChannelId}>`
        : "Any channel";
      const voiceChannelDisplay = currentConfig.voiceChannelId
        ? `<#${currentConfig.voiceChannelId}>`
        : "Dynamic";

      const embed = SolaceEmbed.info(
        "Server Configuration",
        `**DJ Role:** ${djRoleDisplay}\n` +
          `**Default Volume:** \`${currentConfig.defaultVolume}%\`\n` +
          `**Command Channel:** ${textChannelDisplay}\n` +
          `**24/7 Channel:** ${voiceChannelDisplay}\n` +
          `**24/7 Mode:** \`${currentConfig.twentyFourSeven ? "ENABLED" : "DISABLED"}\`\n` +
          `**Vote Skip:** \`${currentConfig.voteSkip ? "ENABLED" : "DISABLED"}\` (Threshold: \`${Math.round(currentConfig.voteSkipRatio * 100)}%\`)`
      );

      return interaction.reply({ embeds: [embed] });
    }

    // 2. Set DJ Role
    if (subcommand === "dj") {
      const role = interaction.options.getRole("role");
      const updated = await db.updateGuildConfig(interaction.guildId, {
        djRoleId: role ? role.id : null,
      });

      return interaction.reply({
        embeds: [
          SolaceEmbed.success(
            "DJ Role Updated",
            role
              ? `Designated <@&${role.id}> as the official DJ role.`
              : "Cleared the custom DJ role. Users with Administrator or a role named 'DJ' retain privileges."
          ),
        ],
      });
    }

    // 3. Set Default Volume
    if (subcommand === "volume") {
      const level = interaction.options.getInteger("level", true);
      await db.updateGuildConfig(interaction.guildId, {
        defaultVolume: level,
      });

      return interaction.reply({
        embeds: [
          SolaceEmbed.success(
            "Default Volume Updated",
            `Default playback volume set to **${level}%** for new sessions.`
          ),
        ],
      });
    }

    // 4. Set Channel Lock / Bind
    if (subcommand === "channel") {
      const type = interaction.options.getString("type", true);
      const channel = interaction.options.getChannel("channel");

      if (type === "text") {
        await db.updateGuildConfig(interaction.guildId, {
          textChannelId: channel ? channel.id : null,
        });

        return interaction.reply({
          embeds: [
            SolaceEmbed.success(
              "Text Channel Binding",
              channel
                ? `Music commands are now restricted to <#${channel.id}>.`
                : "Removed channel lock. Commands can now be used in any channel."
            ),
          ],
        });
      }

      if (type === "voice") {
        await db.updateGuildConfig(interaction.guildId, {
          voiceChannelId: channel ? channel.id : null,
        });

        return interaction.reply({
          embeds: [
            SolaceEmbed.success(
              "Voice Channel Binding",
              channel
                ? `Bound 24/7 playback voice channel to <#${channel.id}>.`
                : "Unbound voice channel."
            ),
          ],
        });
      }
    }

    // 5. Toggle 24/7 mode
    if (subcommand === "247") {
      const enabled = interaction.options.getBoolean("enabled", true);
      await db.updateGuildConfig(interaction.guildId, {
        twentyFourSeven: enabled,
      });

      return interaction.reply({
        embeds: [
          SolaceEmbed.success(
            "24/7 Mode Updated",
            enabled
              ? "24/7 presence enabled. Solace will remain connected in voice channels indefinitely."
              : "24/7 presence disabled. Solace will leave voice channels when idle."
          ),
        ],
      });
    }

    // 6. Configure Vote Skip
    if (subcommand === "voteskip") {
      const enabled = interaction.options.getBoolean("enabled", true);
      const ratio = interaction.options.getNumber("ratio") ?? currentConfig.voteSkipRatio;

      await db.updateGuildConfig(interaction.guildId, {
        voteSkip: enabled,
        voteSkipRatio: ratio,
      });

      return interaction.reply({
        embeds: [
          SolaceEmbed.success(
            "Vote Skip Updated",
            `Vote skipping is now **${enabled ? "ENABLED" : "DISABLED"}** with a threshold of **${Math.round(
              ratio * 100
            )}%** listener votes.`
          ),
        ],
      });
    }
  },
};
