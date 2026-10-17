import dotenv from "dotenv";
import path from "node:path";

// Load from project root .env or apps/bot .env
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });
dotenv.config();

export interface BotConfig {
  token: string;
  clientId: string;
  ownerIds: string[];
  adminIds: string[];
  defaultVolume: number;
  lavalink: {
    name: string;
    url: string;
    auth: string;
    secure: boolean;
  };
  spotify: {
    clientId?: string;
    clientSecret?: string;
  };
}

export const config: BotConfig = {
  token: process.env.DISCORD_TOKEN || "",
  clientId: process.env.DISCORD_CLIENT_ID || "",
  ownerIds: (process.env.BOT_OWNER_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean),
  adminIds: (process.env.BOT_ADMIN_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean),
  defaultVolume: Number.parseInt(process.env.DEFAULT_VOLUME || "80", 10),
  lavalink: {
    name: "Solace-Node-Primary",
    url: `${process.env.LAVALINK_HOST || "localhost"}:${process.env.LAVALINK_PORT || "2333"}`,
    auth: process.env.LAVALINK_PASSWORD || "youshallnotpass",
    secure: process.env.LAVALINK_SECURE === "true",
  },
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  },
};
