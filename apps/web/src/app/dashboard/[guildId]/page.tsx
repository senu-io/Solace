"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Disc3,
  Hash,
  Headphones,
  Music2,
  Radio,
  Save,
  Shield,
  Sliders,
  Volume2,
} from "lucide-react";

interface GuildSettings {
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

export default function GuildDashboardPage({
  params,
}: {
  params: { guildId: string };
}) {
  const [settings, setSettings] = useState<GuildSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch(`/api/guilds/${params.guildId}`);
        const data = await res.json();
        if (data.success) {
          setSettings(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch guild settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, [params.guildId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch(`/api/guilds/${params.guildId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to update guild settings:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-20 text-center">
        <Disc3 className="h-10 w-10 animate-spin text-brand-400 mx-auto" />
        <p className="mt-4 text-zinc-400">Loading server configuration...</p>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-20 text-center">
        <p className="text-red-400">Could not retrieve settings for this guild.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white mb-2 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Servers
          </Link>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <span>Server Management</span>
            <span className="text-xs font-mono font-normal text-zinc-500 bg-surface px-2.5 py-1 rounded-md border border-border">
              ID: {params.guildId}
            </span>
          </h1>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition disabled:opacity-50"
        >
          {savedSuccess ? (
            <>
              <Check className="h-4 w-4 text-emerald-300" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>{saving ? "Saving..." : "Save Settings"}</span>
            </>
          )}
        </button>
      </div>

      {/* Live Web Player Widget */}
      <div className="rounded-2xl border border-border bg-gradient-to-r from-surface to-surfaceHover p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-300">
              <Music2 className="h-8 w-8 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
                  Active Playback
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">Chilled Cow: Lofi Hip Hop Beats</h3>
              <p className="text-sm text-zinc-400">Lofi Girl • 24/7 Persistent Stream</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-2 rounded-xl bg-background/80 border border-border px-3 py-1.5 text-xs font-mono text-zinc-300">
              <Volume2 className="h-3.5 w-3.5 text-brand-400" />
              <span>{settings.defaultVolume}% Vol</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-background/80 border border-border px-3 py-1.5 text-xs font-mono text-zinc-300">
              <Radio className="h-3.5 w-3.5 text-purple-400" />
              <span>{settings.twentyFourSeven ? "24/7 Active" : "Dynamic"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Guild Settings Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DJ Role Assignment */}
        <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">DJ Access Role</h3>
              <p className="text-xs text-zinc-400">Designate the role ID for skipping and filters</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-2">
              Discord Role ID
            </label>
            <input
              type="text"
              value={settings.djRoleId || ""}
              onChange={(e) =>
                setSettings({ ...settings, djRoleId: e.target.value.trim() || null })
              }
              placeholder="e.g. 109876543210987654"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 font-mono"
            />
            <p className="mt-2 text-[11px] text-zinc-500">
              Leave blank to grant DJ privileges to Server Admins and roles named "DJ".
            </p>
          </div>
        </div>

        {/* Default Volume */}
        <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Volume2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Default Volume</h3>
              <p className="text-xs text-zinc-400">Starting volume for new voice sessions</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Playback Level</span>
              <span className="font-bold text-white font-mono">{settings.defaultVolume}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="150"
              value={settings.defaultVolume}
              onChange={(e) =>
                setSettings({ ...settings, defaultVolume: Number(e.target.value) })
              }
              className="w-full accent-brand-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Text Channel Lock */}
        <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Hash className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Command Channel Lock</h3>
              <p className="text-xs text-zinc-400">Restrict bot commands to a specific channel</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-2">
              Text Channel ID
            </label>
            <input
              type="text"
              value={settings.textChannelId || ""}
              onChange={(e) =>
                setSettings({ ...settings, textChannelId: e.target.value.trim() || null })
              }
              placeholder="e.g. 987654321098765432"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 font-mono"
            />
            <p className="mt-2 text-[11px] text-zinc-500">
              Leave blank to allow music commands in any text channel.
            </p>
          </div>
        </div>

        {/* 24/7 Voice Channel Presence */}
        <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Radio className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">24/7 Radio Mode</h3>
              <p className="text-xs text-zinc-400">Keep the bot in voice channel indefinitely</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-sm font-medium text-white block">Enable 24/7 Presence</span>
              <span className="text-xs text-zinc-400">Auto-reconnects on voice node recovery</span>
            </div>
            <button
              type="button"
              onClick={() =>
                setSettings({ ...settings, twentyFourSeven: !settings.twentyFourSeven })
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.twentyFourSeven ? "bg-brand-500" : "bg-surfaceHover"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.twentyFourSeven ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Vote Skip Configuration */}
        <div className="rounded-2xl border border-border bg-surface p-6 space-y-4 md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Democratic Vote-Skip</h3>
              <p className="text-xs text-zinc-400">Configure voting thresholds for non-DJ listeners</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-white block">Allow Member Vote-Skip</span>
                <span className="text-xs text-zinc-400">Non-DJs can vote to skip tracks</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setSettings({ ...settings, voteSkip: !settings.voteSkip })
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.voteSkip ? "bg-brand-500" : "bg-surfaceHover"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.voteSkip ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Vote Quorum Threshold</span>
                <span className="font-bold text-white font-mono">
                  {Math.round(settings.voteSkipRatio * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={settings.voteSkipRatio}
                onChange={(e) =>
                  setSettings({ ...settings, voteSkipRatio: Number(e.target.value) })
                }
                className="w-full accent-brand-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
