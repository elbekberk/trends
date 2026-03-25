/**
 * Display-only formatting: core data stays UTC ISO strings; UI uses Europe/Istanbul.
 */

const ISTANBUL = "Europe/Istanbul";

/** DD-MM-YYYY (Istanbul). */
export function formatIstanbulDate(iso: string | Date | null | undefined): string {
  if (!iso) return "—";
  const d = typeof iso === "string" ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return "—";
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: ISTANBUL,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(d);
  const day = parts.find((p) => p.type === "day")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const year = parts.find((p) => p.type === "year")?.value ?? "";
  if (!day || !month || !year) return "—";
  return `${day}-${month}-${year}`;
}

/** HH:mm 24h (Istanbul). */
export function formatIstanbulTimeHm(iso: string | Date | null | undefined): string {
  if (!iso) return "—";
  const d = typeof iso === "string" ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: ISTANBUL,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

/** DD-MM-YYYY, HH:mm (Istanbul). */
export function formatIstanbulDateTime(iso: string | Date | null | undefined): string {
  if (!iso) return "—";
  const d = typeof iso === "string" ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return "—";
  return `${formatIstanbulDate(d)}, ${formatIstanbulTimeHm(d)}`;
}

/** e.g. "Refreshed at 14:05" */
export function formatRefreshedAtLabel(iso: string | Date | null | undefined): string {
  const t = formatIstanbulTimeHm(iso);
  if (t === "—") return "Refreshed at —";
  return `Refreshed at ${t}`;
}
