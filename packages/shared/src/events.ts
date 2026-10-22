import type { LoopMode, AudioFilter } from "./index.js";

export type PlaybackEventType =
  | "TRACK_START"
  | "TRACK_END"
  | "PLAYER_PAUSE"
  | "PLAYER_RESUME"
  | "VOLUME_CHANGE"
  | "FILTER_CHANGE"
  | "QUEUE_UPDATE"
  | "NODE_STATUS";

export interface LiveTrackInfo {
  title: string;
  author: string;
  uri: string;
  duration: number;
  position: number;
  thumbnail?: string;
  requesterId?: string;
}

export interface LivePlayerState {
  guildId: string;
  playing: boolean;
  paused: boolean;
  volume: number;
  loopMode: LoopMode;
  filter: AudioFilter;
  currentTrack: LiveTrackInfo | null;
  queueLength: number;
  voiceChannelId: string | null;
  updatedAt: number;
}

export interface LiveTelemetryEvent {
  type: PlaybackEventType;
  guildId?: string;
  timestamp: number;
  payload: Record<string, unknown>;
}
