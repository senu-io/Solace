/**
 * Formats milliseconds into a human-readable string (e.g. 03:45 or 01:23:45)
 */
export function formatDuration(ms: number): string {
  if (!ms || ms < 0 || !Number.isFinite(ms)) return "00:00";

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");

  if (hours > 0) {
    const paddedHours = String(hours).padStart(2, "0");
    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  }

  return `${paddedMinutes}:${paddedSeconds}`;
}

/**
 * Parses time strings like "1:30", "01:25:00", "90s", "5m", or "90" into milliseconds.
 */
export function parseDuration(input: string): number | null {
  if (!input) return null;
  const trimmed = input.trim().toLowerCase();

  // Check colon format: HH:MM:SS or MM:SS
  if (trimmed.includes(":")) {
    const parts = trimmed.split(":").map(Number);
    if (parts.some((n) => Number.isNaN(n) || n < 0)) return null;

    if (parts.length === 2) {
      const [minutes, seconds] = parts;
      return (minutes * 60 + seconds) * 1000;
    }
    if (parts.length === 3) {
      const [hours, minutes, seconds] = parts;
      return (hours * 3600 + minutes * 60 + seconds) * 1000;
    }
    return null;
  }

  // Check labeled format: 1h 30m 15s, 90s, 5m
  if (/[hms]/.test(trimmed)) {
    const hours = Number.parseInt(trimmed.match(/(\d+)h/)?.[1] || "0", 10);
    const minutes = Number.parseInt(trimmed.match(/(\d+)m/)?.[1] || "0", 10);
    const seconds = Number.parseInt(trimmed.match(/(\d+)s/)?.[1] || "0", 10);

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    return totalSeconds > 0 ? totalSeconds * 1000 : null;
  }

  // Pure numeric seconds format
  const rawSeconds = Number(trimmed);
  if (!Number.isNaN(rawSeconds) && rawSeconds >= 0) {
    return Math.floor(rawSeconds * 1000);
  }

  return null;
}

/**
 * Creates an interactive text-based audio progress bar
 */
export function createProgressBar(current: number, total: number, size = 15): string {
  if (!total || total <= 0) return `🔘${"▬".repeat(size)}`;

  const progress = Math.min(Math.max(current / total, 0), 1);
  const progressIndex = Math.round(size * progress);

  const before = "▬".repeat(Math.max(0, progressIndex - 1));
  const after = "▬".repeat(Math.max(0, size - progressIndex));

  return `${before}🔘${after}`;
}
