/**
 * Client-only flags for local testing (must use NEXT_PUBLIC_* for bundling).
 * 60s POST /api/ingest from the health panel when true.
 *
 * - `1` / `true` → on
 * - `0` / `false` → off
 * - unset → on in `next dev` only (same behavior as NEXT_PUBLIC_DEV_AUTO_COLLECT=1 for local work)
 */
export function isDevAutoCollectEnabled(): boolean {
  if (typeof process === "undefined") return false;
  const v = process.env.NEXT_PUBLIC_DEV_AUTO_COLLECT;
  if (v === "0" || v === "false") return false;
  if (v === "1" || v === "true") return true;
  return process.env.NODE_ENV === "development";
}
