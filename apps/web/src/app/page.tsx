import Link from "next/link";
import {
  Activity,
  Headphones,
  Radio,
  Server,
  Shield,
  Sliders,
  Sparkles,
  Zap,
} from "lucide-react";

export default function Home() {
  return (
    <div className="relative overflow-hidden py-16 sm:py-24">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-500/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-300">
            <Sparkles className="h-3.5 w-3.5 text-brand-400" />
            Lavalink v4 Audio Engine Active
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            High-fidelity Discord audio,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400">
              pure and uncompromised.
            </span>
          </h1>

          <p className="text-lg text-zinc-400 leading-relaxed">
            Solace brings studio-grade audio streaming from Spotify, YouTube Music, and
            SoundCloud into your voice channels. Engineered with dual web dashboards for
            community managers and host operators.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-xl shadow-brand-500/30 transition hover:-translate-y-0.5"
            >
              <Server className="h-5 w-5" />
              Server Owner Portal
            </Link>

            <Link
              href="/admin"
              className="flex items-center gap-2 rounded-xl bg-surface hover:bg-surfaceHover border border-border px-6 py-3.5 text-base font-semibold text-zinc-300 hover:text-white transition hover:-translate-y-0.5"
            >
              <Shield className="h-5 w-5 text-amber-400" />
              Super Admin Console
            </Link>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-20">
          <div className="rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-sm font-medium">Latency</span>
              <Activity className="h-5 w-5 text-emerald-400" />
            </div>
            <p className="mt-4 text-3xl font-bold text-white">&lt; 15ms</p>
            <p className="mt-1 text-xs text-zinc-500">Lavalink UDP frame buffer</p>
          </div>

          <div className="rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-sm font-medium">Resolution</span>
              <Headphones className="h-5 w-5 text-brand-400" />
            </div>
            <p className="mt-4 text-3xl font-bold text-white">Opus High-Q</p>
            <p className="mt-1 text-xs text-zinc-500">Spotify ISRC & YTM matched</p>
          </div>

          <div className="rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-sm font-medium">Persistence</span>
              <Radio className="h-5 w-5 text-purple-400" />
            </div>
            <p className="mt-4 text-3xl font-bold text-white">24/7 Radio</p>
            <p className="mt-1 text-xs text-zinc-500">Self-healing voice sessions</p>
          </div>

          <div className="rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-sm font-medium">Security</span>
              <Shield className="h-5 w-5 text-amber-400" />
            </div>
            <p className="mt-4 text-3xl font-bold text-white">5-Tier RBAC</p>
            <p className="mt-1 text-xs text-zinc-500">Owner, Admin, DJ, Member</p>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-20 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Built for audiophiles and server creators
            </h2>
            <p className="mt-2 text-zinc-400 text-sm">
              Explore the core architectural advantages of Solace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-border bg-surface p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400">
                <Sliders className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">Acoustic DSP Filters</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Transform any stream on the fly with low-pass Lofi filters, Bass Boost,
                Nightcore, 8D audio rotation, and Vaporwave equalization.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">Instant Web Control</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Server owners can manipulate the live queue, configure dedicated channels,
                and assign DJ roles directly from an intuitive browser dashboard.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <Radio className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">Dual Hosting Readiness</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Run as a self-hosted single instance via Docker Compose or operate as a
                centralized multi-tenant SaaS bot with customer licensing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
