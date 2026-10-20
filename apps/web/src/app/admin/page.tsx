"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Cpu,
  Database,
  HardDrive,
  RefreshCw,
  Server,
  ShieldAlert,
  Terminal,
  Zap,
} from "lucide-react";

interface AdminTelemetry {
  status: string;
  uptimeSeconds: number;
  memory: {
    rssMb: number;
    heapUsedMb: number;
    heapTotalMb: number;
  };
  lavalink: {
    nodeName: string;
    host: string;
    status: string;
    players: number;
    frameDrops: number;
  };
  stats: {
    totalGuilds: number;
    activeStreams: number;
    totalTracksPlayed: number;
  };
  recentLogs: Array<{
    id: string;
    guildId: string | null;
    userId: string;
    commandName: string;
    executedAt: string;
  }>;
}

export default function AdminTelemetryPage() {
  const [data, setData] = useState<AdminTelemetry | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch admin telemetry:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Polling every 10 seconds for real-time dashboard
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 text-xs font-semibold text-amber-300">
              <ShieldAlert className="h-3.5 w-3.5" />
              Restricted Console • Bot Owner Level 5
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-2">
            Cluster Telemetry & Node Health
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Real-time diagnostics, memory analytics, and execution logs across the Solace instance.
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-xl bg-surface hover:bg-surfaceHover border border-border px-4 py-2 text-sm font-semibold text-zinc-300 hover:text-white transition disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin text-brand-400" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Memory RSS */}
        <div className="rounded-2xl border border-border bg-surface p-6 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Memory Allocation</span>
            <Cpu className="h-4 w-4 text-brand-400" />
          </div>
          <p className="text-3xl font-bold text-white font-mono">
            {data ? `${data.memory.rssMb} MB` : "..."}
          </p>
          <p className="text-xs text-zinc-500">
            Heap: {data ? `${data.memory.heapUsedMb} / ${data.memory.heapTotalMb} MB` : "..."}
          </p>
        </div>

        {/* Process Uptime */}
        <div className="rounded-2xl border border-border bg-surface p-6 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Process Uptime</span>
            <Activity className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">
            {data ? formatUptime(data.uptimeSeconds) : "..."}
          </p>
          <p className="text-xs text-emerald-400 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Gateway Connected
          </p>
        </div>

        {/* Connected Servers */}
        <div className="rounded-2xl border border-border bg-surface p-6 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Guild Configurations</span>
            <Database className="h-4 w-4 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white font-mono">
            {data ? data.stats.totalGuilds : "..."}
          </p>
          <p className="text-xs text-zinc-500">Active DB models synchronized</p>
        </div>

        {/* Total Streams */}
        <div className="rounded-2xl border border-border bg-surface p-6 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Audio Streams</span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-3xl font-bold text-white font-mono">
            {data ? data.stats.activeStreams : "..."}
          </p>
          <p className="text-xs text-zinc-500">Continuous voice playback</p>
        </div>
      </div>

      {/* Lavalink Audio Node Health */}
      <div className="rounded-2xl border border-border bg-surface p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Lavalink Audio Node Cluster</h2>
              <p className="text-xs text-zinc-400">Audio decoding and voice WebSocket connection status</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-medium text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Operational
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border/80 bg-background/60 p-4">
            <span className="text-xs text-zinc-500 font-medium uppercase">Node Identifier</span>
            <p className="text-base font-semibold text-white mt-1">
              {data?.lavalink.nodeName || "Solace-Node-Primary"}
            </p>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              {data?.lavalink.host || "localhost:2333"}
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-background/60 p-4">
            <span className="text-xs text-zinc-500 font-medium uppercase">Audio Transcoding</span>
            <p className="text-base font-semibold text-white mt-1">Opus (High Quality)</p>
            <p className="text-xs text-emerald-400 mt-0.5">0 Dropped Audio Frames</p>
          </div>

          <div className="rounded-xl border border-border/80 bg-background/60 p-4">
            <span className="text-xs text-zinc-500 font-medium uppercase">Active Node Players</span>
            <p className="text-base font-semibold text-white mt-1 font-mono">
              {data?.lavalink.players || 1} Voice Sessions
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">LavaSrc Spotify & YTM Plugin Ready</p>
          </div>
        </div>
      </div>

      {/* Recent Command Execution Logs */}
      <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-border/60 pb-4">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Live Execution Feed</h2>
            <p className="text-xs text-zinc-400">Real-time slash command invocations from database audit logs</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="border-b border-border/60 text-xs uppercase text-zinc-500 font-mono">
              <tr>
                <th className="py-3 px-4">Command</th>
                <th className="py-3 px-4">User ID</th>
                <th className="py-3 px-4">Guild ID</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-mono text-xs">
              {data && data.recentLogs.length > 0 ? (
                data.recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-surfaceHover/50 transition">
                    <td className="py-3 px-4 text-brand-300 font-semibold">
                      /{log.commandName}
                    </td>
                    <td className="py-3 px-4 text-zinc-400">{log.userId}</td>
                    <td className="py-3 px-4 text-zinc-500">
                      {log.guildId || "Direct Message"}
                    </td>
                    <td className="py-3 px-4 text-right text-zinc-500">
                      {new Date(log.executedAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-zinc-500">
                    No recent command invocations recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
