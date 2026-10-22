import Link from "next/link";
import { Server, Settings, Plus, ExternalLink, ShieldCheck } from "lucide-react";

export default function DashboardIndexPage() {
  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "1562745565140492298";

  // Mock guild list (in production populated by Discord OAuth /guilds session)
  const userGuilds = [
    {
      id: "123456789012345678",
      name: "Solace Lounge & Community",
      icon: null,
      owner: true,
      botPresent: true,
    },
    {
      id: "234567890123456789",
      name: "Lo-Fi Beats 24/7",
      icon: null,
      owner: false,
      botPresent: true,
    },
    {
      id: "345678901234567890",
      name: "Gaming & Esports Hub",
      icon: null,
      owner: false,
      botPresent: false,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Your Discord Servers</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Select a community server to manage music settings, DJ roles, and queue controls.
          </p>
        </div>

        <a
          href={`https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot%20applications.commands`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl bg-surface hover:bg-surfaceHover border border-border px-4 py-2 text-sm font-semibold text-zinc-300 hover:text-white transition"
        >
          <Plus className="h-4 w-4" />
          <span>Add Solace to New Server</span>
        </a>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userGuilds.map((guild) => {
          const initials = guild.name
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("");

          return (
            <div
              key={guild.id}
              className="rounded-2xl border border-border bg-surface p-6 flex flex-col justify-between hover:border-brand-500/40 transition group"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-surfaceHover border border-border text-lg font-bold text-brand-300">
                  {initials}
                </div>

                <div className="overflow-hidden">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-semibold text-white text-base">
                      {guild.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {guild.owner && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[11px] font-medium text-amber-300">
                        <ShieldCheck className="h-3 w-3" />
                        Server Owner
                      </span>
                    )}
                    <span
                      className={`text-xs font-medium ${
                        guild.botPresent ? "text-emerald-400" : "text-zinc-500"
                      }`}
                    >
                      {guild.botPresent ? "● Connected" : "○ Not Added"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60">
                {guild.botPresent ? (
                  <Link
                    href={`/dashboard/${guild.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500/15 hover:bg-brand-500 border border-brand-500/30 hover:border-transparent py-2.5 text-sm font-semibold text-brand-200 hover:text-white transition"
                  >
                    <Settings className="h-4 w-4" />
                    Configure Server
                  </Link>
                ) : (
                  <a
                    href={`https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot%20applications.commands&guild_id=${guild.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-surfaceHover hover:bg-surface border border-border py-2.5 text-sm font-semibold text-zinc-300 hover:text-white transition"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Invite Bot
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
