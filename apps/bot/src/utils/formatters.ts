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
