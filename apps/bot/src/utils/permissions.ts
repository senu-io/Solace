import { GuildMember, PermissionsBitField } from "discord.js";
import { PermissionLevel } from "@solace/shared";
import { config } from "../config.js";
import { db } from "@solace/database";

export async function getMemberPermissionLevel(
  member: GuildMember
): Promise<PermissionLevel> {
  const userId = member.user.id;

  // 1. Bot Owner
  if (config.ownerIds.includes(userId)) {
    return PermissionLevel.BOT_OWNER;
  }

  // 2. Bot Admin
  if (config.adminIds.includes(userId)) {
    return PermissionLevel.BOT_ADMIN;
  }

  // 3. Server Owner or Server Administrator / Manager
  const isGuildOwner = member.guild.ownerId === userId;
  const hasAdminPerm = member.permissions.has(PermissionsBitField.Flags.Administrator);
  const hasManageGuild = member.permissions.has(PermissionsBitField.Flags.ManageGuild);

  if (isGuildOwner || hasAdminPerm || hasManageGuild) {
    return PermissionLevel.SERVER_ADMIN;
  }

  // 4. DJ Role holder
  const guildConfig = await db.getGuildConfig(member.guild.id);
  const hasDjRole =
    guildConfig.djRoleId && member.roles.cache.has(guildConfig.djRoleId);
  const hasNamedDjRole = member.roles.cache.some(
    (role) => role.name.toLowerCase() === "dj"
  );

  if (hasDjRole || hasNamedDjRole) {
    return PermissionLevel.DJ;
  }

  // 5. Standard Server Member
  return PermissionLevel.MEMBER;
}

export async function checkPermission(
  member: GuildMember,
  requiredLevel: PermissionLevel
): Promise<{ allowed: boolean; currentLevel: PermissionLevel }> {
  const currentLevel = await getMemberPermissionLevel(member);
  return {
    allowed: currentLevel >= requiredLevel,
    currentLevel,
  };
}

export function formatPermissionLevelName(level: PermissionLevel): string {
  switch (level) {
    case PermissionLevel.BOT_OWNER:
      return "Bot Owner";
    case PermissionLevel.BOT_ADMIN:
      return "Bot Admin";
    case PermissionLevel.SERVER_ADMIN:
      return "Server Administrator";
    case PermissionLevel.DJ:
      return "DJ";
    case PermissionLevel.MEMBER:
    default:
      return "Server Member";
  }
}
