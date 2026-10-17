import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
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
  djOnly?: boolean;
  ownerOnly?: boolean;
  run: (context: CommandContext) => Promise<unknown>;
}
