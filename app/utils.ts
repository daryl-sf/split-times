export function convertMsToTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  return `${String(hours).padStart(2, "0")}:${String(
    minutes % 60,
  ).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}
