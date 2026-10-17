import { REST, Routes } from "discord.js";
import { green, red, yellow } from "colorette";
import { commands } from "./commands/index.js";
import { config } from "./config.js";

async function deployCommands() {
  if (!config.token || !config.clientId) {
    console.error(red("[Error] DISCORD_TOKEN and DISCORD_CLIENT_ID must be set in .env to deploy commands."));
    process.exit(1);
  }

  const rest = new REST({ version: "10" }).setToken(config.token);
  const commandData = commands.map((cmd) => cmd.data.toJSON());

  console.log(yellow(`[Deploy] Registering ${commandData.length} application slash commands...`));

  try {
    await rest.put(Routes.applicationCommands(config.clientId), {
      body: commandData,
    });
    console.log(green(`[Deploy] Successfully registered ${commandData.length} global slash commands!`));
  } catch (error) {
    console.error(red("[Deploy] Failed to register slash commands:"), error);
  }
}

deployCommands();
