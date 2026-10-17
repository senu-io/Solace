import type { ClientEvents } from "discord.js";
import type { SolaceClient } from "../client/SolaceClient.js";

export interface Event<K extends keyof ClientEvents> {
  name: K;
  once?: boolean;
  run: (client: SolaceClient, ...args: ClientEvents[K]) => Promise<unknown> | unknown;
}
