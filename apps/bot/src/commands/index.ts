import type { Command } from "../structures/Command.js";
import { pauseCommand } from "./music/pause.js";
import { playCommand } from "./music/play.js";
import { queueCommand } from "./music/queue.js";
import { resumeCommand } from "./music/resume.js";
import { skipCommand } from "./music/skip.js";
import { stopCommand } from "./music/stop.js";
import { pingCommand } from "./utility/ping.js";

export const commands: Command[] = [
  playCommand,
  pauseCommand,
  resumeCommand,
  skipCommand,
  stopCommand,
  queueCommand,
  pingCommand,
];
