import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Solace | Next-Gen Discord Music System",
  description:
    "High-fidelity Discord music playback from Spotify, YouTube Music, and SoundCloud with dual management dashboards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background antialiased flex flex-col justify-between">
        <header>
          <Navbar />
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border py-8 text-center text-sm text-zinc-500">
          <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>
              &copy; {new Date().getFullYear()} Solace Music System. Crafted for high-fidelity communities.
            </p>
            <div className="flex items-center gap-6">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Cluster Operational
              </span>
              <span>Lavalink v4</span>
              <span>Discord.js v14</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
