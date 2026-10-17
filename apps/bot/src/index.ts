import { blue, green } from "colorette";
import { SolaceClient } from "./client/SolaceClient.js";
import { commands } from "./commands/index.js";
import { handleInteraction } from "./events/interactionCreate.js";

async function bootstrap() {
  console.log(blue("========================================"));
  console.log(blue("          🎵 INITIALIZING SOLACE        "));
  console.log(blue("========================================"));

  const client = new SolaceClient();

  // Register commands in client collection
  for (const command of commands) {
    client.commands.set(command.data.name, command);
  }
  console.log(green(`[Commands] Loaded ${client.commands.size} slash commands into memory.`));

  // Register interaction listener
  client.on("interactionCreate", (interaction) => {
    handleInteraction(client, interaction);
  });

  // Handle graceful shutdowns
  const shutdown = async () => {
    console.log(blue("\n[Shutdown] Cleaning up connections and disconnecting..."));
    for (const player of client.lavalink.players.values()) {
      await player.destroy();
    }
    client.destroy();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  await client.start();
}

bootstrap().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
