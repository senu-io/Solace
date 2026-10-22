import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection event
      const initialPayload = JSON.stringify({
        type: "CONNECTED",
        timestamp: Date.now(),
        message: "Solace live telemetry stream established",
      });
      controller.enqueue(encoder.encode(`event: status\ndata: ${initialPayload}\n\n`));

      // Periodic heartbeat ping to keep connection alive
      const interval = setInterval(() => {
        try {
          const heartbeatPayload = JSON.stringify({
            type: "HEARTBEAT",
            timestamp: Date.now(),
            uptime: Math.floor(process.uptime()),
          });
          controller.enqueue(encoder.encode(`event: ping\ndata: ${heartbeatPayload}\n\n`));
        } catch {
          clearInterval(interval);
        }
      }, 15000);

      // Clean up when stream closes
      return () => {
        clearInterval(interval);
      };
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
