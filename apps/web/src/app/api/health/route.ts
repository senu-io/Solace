import { NextResponse } from "next/server";
import { prisma } from "@solace/database";

export const dynamic = "force-dynamic";

export async function GET() {
  let dbStatus = "healthy";

  try {
    if (process.env.DATABASE_URL) {
      await prisma.$queryRaw`SELECT 1`;
    } else {
      dbStatus = "degraded-memory-fallback";
    }
  } catch {
    dbStatus = "disconnected";
  }

  const memory = process.memoryUsage();

  return NextResponse.json(
    {
      status: dbStatus === "disconnected" ? "degraded" : "healthy",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: dbStatus,
      memory: {
        rssMb: Math.round(memory.rss / (1024 * 1024)),
        heapUsedMb: Math.round(memory.heapUsed / (1024 * 1024)),
        heapTotalMb: Math.round(memory.heapTotal / (1024 * 1024)),
      },
      service: "solace-web",
      version: "1.0.0",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
