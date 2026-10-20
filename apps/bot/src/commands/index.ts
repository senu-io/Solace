import type { Command } from "../structures/Command.js";
import { clearCommand } from "./music/clear.js";
import { filterCommand } from "./music/filter.js";
import { loopCommand } from "./music/loop.js";
import { nowplayingCommand } from "./music/nowplaying.js";
import { pauseCommand } from "./music/pause.js";
import { playCommand } from "./music/play.js";
import { previousCommand } from "./music/previous.js";
import { queueCommand } from "./music/queue.js";
import { radioCommand } from "./music/radio.js";
import { removeCommand } from "./music/remove.js";
import { resumeCommand } from "./music/resume.js";
import { seekCommand } from "./music/seek.js";
import { shuffleCommand } from "./music/shuffle.js";
import { skipCommand } from "./music/skip.js";
import { stopCommand } from "./music/stop.js";
import { volumeCommand } from "./music/volume.js";
import { pingCommand } from "./utility/ping.js";

export const commands: Command[] = [
  playCommand,
  pauseCommand,
  resumeCommand,
  skipCommand,
  stopCommand,
  queueCommand,
  nowplayingCommand,
  seekCommand,
  shuffleCommand,
  loopCommand,
  volumeCommand,
  filterCommand,
  previousCommand,
  clearCommand,
  removeCommand,
  radioCommand,
  pingCommand,
];
