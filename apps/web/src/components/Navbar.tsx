import Link from "next/link";
import { Disc3, Server, Shield, Sparkles, ExternalLink } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 border border-brand-500/40 text-brand-400">
            <Disc3 className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-brand-300 transition">
              Solace
            </span>
            <span className="text-xs text-zinc-400">
              Music Engine
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1.5 shadow-inner">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-surfaceHover transition"
          >
            <Sparkles className="h-4 w-4 text-brand-400" />
            Home
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-surfaceHover transition"
          >
            <Server className="h-4 w-4 text-zinc-400" />
            Server Settings
          </Link>
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-surfaceHover transition"
          >
            <Shield className="h-4 w-4 text-amber-400" />
            Admin Telemetry
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href="https://discord.com/api/oauth2/authorize?client_id=1234567890&permissions=8&scope=bot%20applications.commands"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 rounded-xl bg-surface border border-border px-4 py-2 text-sm font-semibold text-zinc-300 hover:bg-surfaceHover hover:text-white transition"
          >
            <span>Invite</span>
            <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
          </a>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition active:scale-95"
          >
            Open Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
