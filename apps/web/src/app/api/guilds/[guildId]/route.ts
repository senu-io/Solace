import { NextRequest, NextResponse } from "next/server";
import { db } from "@solace/database";

export async function GET(
  _request: NextRequest,
  { params }: { params: { guildId: string } }
) {
  try {
    const config = await db.getGuildConfig(params.guildId);
    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    console.error(`Failed to get guild config for ${params.guildId}:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch configuration" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { guildId: string } }
) {
  try {
    const body = await request.json();
    const allowedKeys = [
      "djRoleId",
      "defaultVolume",
      "twentyFourSeven",
      "voiceChannelId",
      "textChannelId",
      "voteSkip",
      "voteSkipRatio",
    ];

    const updateData: Record<string, unknown> = {};
    for (const key of allowedKeys) {
      if (key in body) {
        updateData[key] = body[key];
      }
    }

    const updated = await db.updateGuildConfig(params.guildId, updateData);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error(`Failed to update guild config for ${params.guildId}:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to update configuration" },
      { status: 500 }
    );
  }
}
