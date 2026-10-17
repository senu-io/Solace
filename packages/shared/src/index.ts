/**
 * Solace Permission Levels
 */
export enum PermissionLevel {
  MEMBER = 1,
  DJ = 2,
  SERVER_ADMIN = 3,
  BOT_ADMIN = 4,
  BOT_OWNER = 5,
}

/**
 * Loop Mode
 */
export enum LoopMode {
  OFF = "off",
  TRACK = "track",
  QUEUE = "queue",
}

/**
 * Audio Filter Presets
 */
export enum AudioFilter {
  NONE = "none",
  LOFI = "lofi",
  BASSBOOST = "bassboost",
  NIGHTCORE = "nightcore",
  EIGHT_D = "8d",
}
