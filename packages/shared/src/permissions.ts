import { PermissionLevel } from "./index.js";

/**
 * Returns user-facing name for a given permission level
 */
export function formatPermissionLevelName(level: PermissionLevel): string {
  switch (level) {
    case PermissionLevel.BOT_OWNER:
      return "Bot Owner";
    case PermissionLevel.BOT_ADMIN:
      return "Bot Admin";
    case PermissionLevel.SERVER_ADMIN:
      return "Server Admin";
    case PermissionLevel.DJ:
      return "DJ";
    case PermissionLevel.MEMBER:
      return "Member";
    default:
      return "Unknown";
  }
}

/**
 * Validates whether user permission meets or exceeds required level
 */
export function isPermissionSufficient(
  userLevel: PermissionLevel,
  requiredLevel: PermissionLevel
): boolean {
  return userLevel >= requiredLevel;
}
