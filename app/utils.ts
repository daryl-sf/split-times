export function convertMsToTime(ms: number): string {
  const totalMs = Math.abs(ms);
  const tenths = Math.floor((totalMs % 1000) / 100);
  const seconds = Math.floor(totalMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  return `${String(hours).padStart(2, "0")}:${String(
    minutes % 60,
  ).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}.${tenths}`;
}
