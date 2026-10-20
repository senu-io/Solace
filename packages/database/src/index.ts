import { PrismaClient } from "@prisma/client";

// Global singleton to prevent multiple Prisma instances in dev
declare global {
  // eslint-disable-next-line no-var
  var __solace_prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.__solace_prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__solace_prisma = prisma;
}

export interface GuildConfigData {
  guildId: string;
  prefix: string;
  defaultVolume: number;
  djRoleId: string | null;
  twentyFourSeven: boolean;
  voiceChannelId: string | null;
  textChannelId: string | null;
  voteSkip: boolean;
  voteSkipRatio: number;
}

export interface SavedTrack {
  title: string;
  author: string;
  uri: string;
  duration: number;
  artworkUrl?: string | null;
}

export interface PlaylistData {
  id: string;
  userId: string;
  name: string;
  isPublic: boolean;
  tracks: SavedTrack[];
}

// In-memory fallback caches when PostgreSQL is offline in development
const inMemoryGuildConfigs = new Map<string, GuildConfigData>();
const inMemoryPlaylists = new Map<string, PlaylistData[]>();
let isPostgresAvailable: boolean | null = null;

async function checkDatabaseConnection(): Promise<boolean> {
  if (isPostgresAvailable !== null) return isPostgresAvailable;
  if (!process.env.DATABASE_URL) {
    isPostgresAvailable = false;
    return false;
  }
  try {
    await prisma.$queryRaw`SELECT 1`;
    isPostgresAvailable = true;
    return true;
  } catch {
    isPostgresAvailable = false;
    return false;
  }
}

export const db = {
  prisma,

  async getGuildConfig(guildId: string): Promise<GuildConfigData> {
    const isDbReady = await checkDatabaseConnection();

    if (isDbReady) {
      const config = await prisma.guildConfig.upsert({
        where: { guildId },
        update: {},
        create: { guildId },
      });
      return config;
    }

    if (!inMemoryGuildConfigs.has(guildId)) {
      inMemoryGuildConfigs.set(guildId, {
        guildId,
        prefix: "!",
        defaultVolume: 80,
        djRoleId: null,
        twentyFourSeven: false,
        voiceChannelId: null,
        textChannelId: null,
        voteSkip: true,
        voteSkipRatio: 0.5,
      });
    }

    return inMemoryGuildConfigs.get(guildId)!;
  },

  async updateGuildConfig(
    guildId: string,
    data: Partial<Omit<GuildConfigData, "guildId">>
  ): Promise<GuildConfigData> {
    const isDbReady = await checkDatabaseConnection();

    if (isDbReady) {
      return prisma.guildConfig.upsert({
        where: { guildId },
        update: data,
        create: { guildId, ...data },
      });
    }

    const current = await this.getGuildConfig(guildId);
    const updated = { ...current, ...data };
    inMemoryGuildConfigs.set(guildId, updated);
    return updated;
  },

  async getUserPlaylists(userId: string): Promise<PlaylistData[]> {
    const isDbReady = await checkDatabaseConnection();

    if (isDbReady) {
      const list = await prisma.playlist.findMany({
        where: { userId },
        include: { tracks: { orderBy: { position: "asc" } } },
      });
      return list.map((p) => ({
        id: p.id,
        userId: p.userId,
        name: p.name,
        isPublic: p.isPublic,
        tracks: p.tracks.map((t) => ({
          title: t.title,
          author: t.author,
          uri: t.uri,
          duration: t.duration,
          artworkUrl: t.artworkUrl,
        })),
      }));
    }

    return inMemoryPlaylists.get(userId) || [];
  },

  async getPlaylist(userId: string, name: string): Promise<PlaylistData | null> {
    const isDbReady = await checkDatabaseConnection();

    if (isDbReady) {
      const p = await prisma.playlist.findFirst({
        where: { userId, name },
        include: { tracks: { orderBy: { position: "asc" } } },
      });
      if (!p) return null;
      return {
        id: p.id,
        userId: p.userId,
        name: p.name,
        isPublic: p.isPublic,
        tracks: p.tracks.map((t) => ({
          title: t.title,
          author: t.author,
          uri: t.uri,
          duration: t.duration,
          artworkUrl: t.artworkUrl,
        })),
      };
    }

    const userLists = inMemoryPlaylists.get(userId) || [];
    return userLists.find((p) => p.name.toLowerCase() === name.toLowerCase()) || null;
  },

  async createPlaylist(
    userId: string,
    name: string,
    isPublic = false
  ): Promise<PlaylistData> {
    const isDbReady = await checkDatabaseConnection();

    if (isDbReady) {
      // Ensure user exists first
      await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: { id: userId },
      });

      const p = await prisma.playlist.create({
        data: {
          userId,
          name,
          isPublic,
        },
      });

      return {
        id: p.id,
        userId: p.userId,
        name: p.name,
        isPublic: p.isPublic,
        tracks: [],
      };
    }

    const userLists = inMemoryPlaylists.get(userId) || [];
    const existing = userLists.find((p) => p.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      throw new Error(`Playlist "${name}" already exists.`);
    }

    const newPlaylist: PlaylistData = {
      id: String(Date.now()),
      userId,
      name,
      isPublic,
      tracks: [],
    };
    userLists.push(newPlaylist);
    inMemoryPlaylists.set(userId, userLists);
    return newPlaylist;
  },

  async addTrackToPlaylist(
    userId: string,
    name: string,
    track: SavedTrack
  ): Promise<boolean> {
    const isDbReady = await checkDatabaseConnection();

    if (isDbReady) {
      const p = await prisma.playlist.findFirst({
        where: { userId, name },
        include: { tracks: true },
      });
      if (!p) return false;

      await prisma.playlistTrack.create({
        data: {
          playlistId: p.id,
          title: track.title,
          author: track.author,
          uri: track.uri,
          duration: track.duration,
          artworkUrl: track.artworkUrl,
          position: p.tracks.length + 1,
        },
      });
      return true;
    }

    const playlist = await this.getPlaylist(userId, name);
    if (!playlist) return false;

    playlist.tracks.push(track);
    return true;
  },

  async deletePlaylist(userId: string, name: string): Promise<boolean> {
    const isDbReady = await checkDatabaseConnection();

    if (isDbReady) {
      const p = await prisma.playlist.findFirst({
        where: { userId, name },
      });
      if (!p) return false;

      await prisma.playlist.delete({ where: { id: p.id } });
      return true;
    }

    const userLists = inMemoryPlaylists.get(userId) || [];
    const index = userLists.findIndex((p) => p.name.toLowerCase() === name.toLowerCase());
    if (index === -1) return false;

    userLists.splice(index, 1);
    return true;
  },

  async logCommand(
    guildId: string | null,
    userId: string,
    commandName: string
  ): Promise<void> {
    const isDbReady = await checkDatabaseConnection();
    if (!isDbReady) return;

    await prisma.commandLog
      .create({
        data: {
          guildId,
          userId,
          commandName,
        },
      })
      .catch(() => null);
  },
};

export * from "@prisma/client";
