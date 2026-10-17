<div align="center">
  <img src="assets/logo.png" alt="Solace Logo" width="140" height="140" />
  <h1>Solace</h1>
  <p><strong>Next-Generation Multi-Source Discord Music System with Dual Management Dashboards</strong></p>

  <p>
    <a href="#features">Features</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#permission-hierarchy">Permissions</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#project-structure">Project Structure</a> •
    <a href="#roadmap">Roadmap</a>
  </p>
</div>

---

## 🎵 Overview

**Solace** is a high-performance, modern Discord music bot engineered for audiophiles and community managers. Powered by **Lavalink v4** and built with **TypeScript**, Solace delivers low-latency, crystal-clear playback from **Spotify**, **YouTube Music**, and **SoundCloud**.

Beyond standard music bot commands, Solace introduces a **dual web dashboard** architecture:
1. **Server Owner Dashboard**: Full server-level control over DJ roles, channel binds, 24/7 radio, volume limits, and interactive web queues.
2. **Bot Owner / Super Admin Dashboard**: Real-time telemetry, node health monitoring, memory analytics, and remote debugging tools.

Solace is built for both **self-hosting** (via Docker Compose) and **managed SaaS deployment** (multi-tenant with role-based access control).

---

## ✨ Features

### 🎧 Audio & Streaming
- **Multi-Source Support**: Seamless streaming from **Spotify**, **YouTube Music**, and **SoundCloud**.
- **Spotify Metadata Resolution**: Automatically matches Spotify tracks, playlists, and albums to the highest quality streams.
- **Audio DSP Filters**: Real-time **Lofi Mode**, Bass Boost, Nightcore, 8D, and custom Equalizer presets.
- **24/7 Radio Mode**: Keeps the bot connected to designated voice channels with automatic reconnection.
- **Rich Playback Controls**: Next, Back, Seek, Shuffle, Repeat (One / All), Pause, Resume, and Queue Pagination.
- **Personal & Server Playlists**: Save and load custom queues directly inside Discord.

### 🎮 Modern Discord Experience
- **Slash Commands First**: 100% powered by Discord Application Commands (`/play`, `/queue`, etc.).
- **Interactive Component UI**: Control playback using dynamic Discord buttons, dropdown menus, and responsive embeds.
- **Vote Skip & Smart Skip**: Democratic voting for standard listeners with immediate skip authority for DJs and Admins.

### 🖥️ Dual Web Dashboards
- **Server Owner Portal**:
  - Live "Now Playing" web player with real-time queue synchronization.
  - Dedicated DJ role designation and voice/text channel locking.
  - Granular server preferences (default volume, vote-skip percentage, 24/7 toggle).
- **Master Admin Console**:
  - Cluster telemetry: CPU, RAM, active players, and Lavalink audio frame drop rates.
  - Global guild inspector and remote debug console.
  - Global blacklists and system broadcast alerts.

---

## 🏛️ Architecture

Solace decouples audio streaming from the Discord bot process using **Lavalink v4**, ensuring the bot remains responsive even under heavy audio workloads.

```
                         ┌───────────────────────┐
                         │      Discord API      │
                         └───────────┬───────────┘
                                     │
                   Gateway Events &  │  Slash Commands
                                     ▼
┌──────────────────┐     ┌───────────────────────┐
│ Spotify API /    │     │      Solace Bot       │
│ Soundcloud / YTM │◄────┤      (TypeScript)     │
└────────▲─────────┘     └───────────┬───────────┘
         │                           │
  Audio Metadata                     │ IPC / State Cache (Redis)
         │                           ▼
┌────────┴─────────┐     ┌───────────────────────┐
│   Lavalink v4    │     │     Web Dashboard     │
│  (Opus Audio)    │     │  (Next.js + Tailwind) │
└────────┬─────────┘     └───────────────────────┘
         │
         ▼
[ Discord Voice Channel ]
```

---

## 🔐 Permission Hierarchy

Solace enforces a strict 5-tier Role-Based Access Control (RBAC) model:

| Level | Role | Scope | Capabilities |
| :---: | :--- | :--- | :--- |
| **5** | **Bot Owner** | Global | Full system control, eval/debug commands, global announcement, cluster node health. |
| **4** | **Bot Admin** | Global | Global analytics, node inspection, error log auditing, guild blacklisting. |
| **3** | **Server Owner / Admin** | Guild | Configure server settings, bind DJ roles, set 24/7 voice channels, command channel locks. |
| **2** | **DJ Role Holder** | Guild | Immediate skip, force stop, seek, clear queue, toggle 24/7 radio, apply audio filters. |
| **1** | **Standard Member** | Guild | Request songs, view queue, vote-skip, loop own tracks, manage personal playlists. |

---

## 📁 Project Structure

Solace is organized as a clean, modular monorepo:

```text
Solace/
├── apps/
│   ├── bot/                # Discord bot (discord.js, lavalink client, commands)
│   └── web/                # Next.js web dashboards (Server Owner & Admin)
├── packages/
│   ├── database/           # Prisma ORM schema & shared database client
│   └── shared/             # Shared types, constants, and utilities
├── lavalink/               # Lavalink v4 configuration & plugins
│   └── application.yml
├── assets/                 # Brand assets, logos, and icons
├── docker-compose.yml      # Orchestration for Bot, Lavalink, Web, DB & Redis
├── .env.example            # Environment variables blueprint
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.0.0` or higher
- **Java**: `Java 17+` (for Lavalink v4)
- **Discord Developer Application**: With Bot Token, Client ID, and Voice/Guild intents enabled.
- **Spotify Developer Application**: Client ID and Client Secret (for Spotify link resolution).

### Quick Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/senu-io/Solace.git
   cd Solace
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your Discord Token, Spotify credentials, and Lavalink secrets
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Launch Lavalink (Audio Node):**
   ```bash
   cd lavalink
   java -jar Lavalink.jar
   ```

5. **Start Solace:**
   ```bash
   npm run dev
   ```

---

## 🗺️ Roadmap

- [x] **Project initialization & monorepo architecture**
- [ ] **Phase 1**: Audio Core with Lavalink v4 & basic playback commands (`/play`, `/pause`, `/stop`)
- [ ] **Phase 2**: Queue Engine, dynamic button components, DSP filters (Lofi, Bassboost) & Seek
- [ ] **Phase 3**: PostgreSQL database integration & Guild RBAC (DJ role, 24/7 mode)
- [ ] **Phase 4**: Next.js Web Dashboards (Server Owner management & Super Admin telemetry)
- [ ] **Phase 5**: Docker Compose packaging & production deployment guides

---

<div align="center">
  <sub>Crafted with passion for music and modern Discord communities.</sub>
</div>
