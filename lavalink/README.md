# Lavalink v4 Audio Node for Solace

This directory contains the configuration for the standalone audio node that powers Solace.

## How it Works
Solace delegates all audio extraction, decoding, filtering, and voice channel streaming to Lavalink v4. This ensures low latency and high quality without degrading bot responsiveness.

### Features Configured in `application.yml`:
- **LavaSrc Plugin**: Resolves Spotify metadata and tracks automatically using ISRC matching on YouTube/SoundCloud.
- **YouTube Plugin**: Uses multiple clients (`MUSIC`, `WEB`, `ANDROID`) for reliable YouTube playback.
- **SoundCloud**: Native direct audio streaming.
- **Audio Filters**: Low-pass filter (for Lofi mode), Equalizer, Timescale, and Volume.

## Quickstart (Running Lavalink)

1. Ensure **Java 17 or higher** is installed (`java -version`).
2. Download the latest `Lavalink.jar` (v4.x) from the official GitHub releases:
   ```powershell
   Invoke-WebRequest -Uri "https://github.com/lavalink-devs/Lavalink/releases/latest/download/Lavalink.jar" -OutFile "Lavalink.jar"
   ```
3. Run Lavalink:
   ```bash
   java -jar Lavalink.jar
   ```
   *(On first run, Lavalink will automatically download the plugins defined in `application.yml`).*
