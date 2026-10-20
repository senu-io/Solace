import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import type { PermissionLevel } from "@solace/shared";
import type { SolaceClient } from "../client/SolaceClient.js";

export type SlashCommandData =
  | SlashCommandBuilder
  | SlashCommandOptionsOnlyBuilder
  | SlashCommandSubcommandsOnlyBuilder
  | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

export interface CommandContext {
  client: SolaceClient;
  interaction: ChatInputCommandInteraction;
}

export interface Command {
  data: SlashCommandData;
  category: "music" | "filters" | "settings" | "utility" | "admin";
  voiceChannelRequired?: boolean;
  sameVoiceChannelRequired?: boolean;
  requiredPermission?: PermissionLevel;
  run: (context: CommandContext) => Promise<unknown>;
}
