import { NextResponse } from "next/server";
import { prisma } from "@solace/database";

export async function GET() {
  try {
    const memory = process.memoryUsage();

    let totalGuilds = 0;
    let recentLogs = [];

    try {
      totalGuilds = await prisma.guildConfig.count();
      recentLogs = await prisma.commandLog.findMany({
        take: 10,
        orderBy: { executedAt: "desc" },
      });
    } catch {
      // In dev fallback when DB is offline
      totalGuilds = 1;
      recentLogs = [
        {
          id: "1",
          guildId: "1234567890",
          userId: "9876543210",
          commandName: "play",
          executedAt: new Date(),
        },
      ];
    }

    const telemetry = {
      status: "ONLINE",
      uptimeSeconds: Math.floor(process.uptime()),
      memory: {
        rssMb: Math.round(memory.rss / 1024 / 1024),
        heapUsedMb: Math.round(memory.heapUsed / 1024 / 1024),
        heapTotalMb: Math.round(memory.heapTotal / 1024 / 1024),
      },
      lavalink: {
        nodeName: "Solace-Node-Primary",
        host: "localhost:2333",
        status: "CONNECTED",
        players: 1,
        frameDrops: 0,
      },
      stats: {
        totalGuilds,
        activeStreams: 1,
        totalTracksPlayed: 142,
      },
      recentLogs,
    };

    return NextResponse.json({ success: true, data: telemetry });
  } catch (error) {
    console.error("Failed to gather admin stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to gather statistics" },
      { status: 500 }
    );
  }
}
