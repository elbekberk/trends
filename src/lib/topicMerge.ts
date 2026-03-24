import { matchMajorTheme } from "@/src/lib/canonicalParents";

export type TopicCategory = "geopolitics" | "technology" | "economy" | "general";

/** Clear military / strategic signals in titles (simple substring checks on a lowercased blob). */
const GEO_TITLE_WORDS = [
  "war",
  "military",
  "strike",
  "troops",
  "missile",
  "navy",
  "army",
  "invasion",
  "nato",
  "sanctions",
  "defense",
  "pentagon",
  "fighter",
  "drone",
  "border",
  "tank",
  "bombing",
  "airstrike",
  "warship",
  "regime",
];

const GEO_KEY_SUBSTRINGS = [
  "iran",
  "israel",
  "ukraine",
  "war",
  "conflict",
  "military",
  "diplomatic",
  "sanction",
  "trump",
  "saudi",
  "nato",
  "russia",
  "china",
  "gulf",
  "syria",
];

/** Technology: avoid lone "cyber" — prefer compound or product signals. */
const TECH_WORDS = [
  "ai",
  "openai",
  "anthropic",
  "chip",
  "software",
  "cloud",
  "github",
  "microsoft",
  "google",
  "apple",
  "model",
  "llm",
  "gpu",
  "startup",
  "cryptocurrency",
  "bitcoin",
  "cybersecurity",
  "cyberattack",
  "ransomware",
  "hacker",
  "breach",
];

const ECON_WORDS = [
  "economy",
  "inflation",
  "market",
  "stocks",
  "gdp",
  "trade",
  "oil",
  "rates",
  "jobs",
  "recession",
  "fed",
  "earnings",
  "invest",
];

function normalizeToken(token: string): string {
  let value = token.toLowerCase();
  if (value.length > 5 && value.endsWith("ing")) value = value.slice(0, -3);
  else if (value.length > 4 && value.endsWith("ed")) value = value.slice(0, -2);
  else if (value.length > 4 && value.endsWith("s")) value = value.slice(0, -1);
  return value;
}

function titleTokens(title: string): Set<string> {
  const cleaned = title.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
  const parts = cleaned
    .split(/\s+/)
    .filter((t) => t.length >= 3 && t.length <= 24);
  return new Set(parts.map(normalizeToken));
}

export type TopicHitRowForMerge = {
  canonicalParentKey: string | null;
  parentKey: string;
  canonicalParentLabel: string | null;
  parentLabel: string;
  post: { title: string };
};

/**
 * Read-time display parent: reuse `matchMajorTheme` only — no extra rule tables.
 */
export function displayParentForRow(row: TopicHitRowForMerge): { key: string; label: string } {
  const titleLower = row.post.title.toLowerCase();
  const rawKey = row.canonicalParentKey ?? row.parentKey;
  const tokens = titleTokens(row.post.title);
  const themed = matchMajorTheme(rawKey, titleLower, tokens);
  if (themed) {
    return { key: themed.canonicalParentKey, label: themed.canonicalParentLabel };
  }
  return {
    key: rawKey,
    label: row.canonicalParentLabel ?? row.parentLabel,
  };
}

export function groupRowsByDisplayParent<Row extends TopicHitRowForMerge>(
  rows: Row[],
): Map<string, Row[]> {
  const map = new Map<string, Row[]>();
  for (const row of rows) {
    const { key } = displayParentForRow(row);
    map.set(key, [...(map.get(key) ?? []), row]);
  }
  return map;
}

/**
 * Ordered, debuggable: theme prefixes → geo title words → tech/economy keywords → geo key → general.
 */
export function inferTopicCategory(canonicalKey: string, titles: string[]): TopicCategory {
  const k = canonicalKey.toLowerCase();
  const blob = `${k} ${titles.join(" ")}`.toLowerCase();

  if (
    k.startsWith("us-iran") ||
    k.startsWith("ukraine-russia") ||
    k.includes("conflict") ||
    k.includes("sanction")
  ) {
    return "geopolitics";
  }
  if (k.startsWith("apple-") || k.startsWith("us-router")) return "technology";
  if (k.startsWith("oil-energy")) return "economy";

  for (const w of GEO_TITLE_WORDS) {
    if (blob.includes(w)) return "geopolitics";
  }

  for (const w of TECH_WORDS) {
    if (k.includes(w) || blob.includes(w)) return "technology";
  }
  for (const w of ECON_WORDS) {
    if (k.includes(w) || blob.includes(w)) return "economy";
  }

  for (const w of GEO_KEY_SUBSTRINGS) {
    if (k.includes(w)) return "geopolitics";
  }

  return "general";
}

export function assignCategoryFromKeyAndTitle(canonicalKey: string, titleLower: string): TopicCategory {
  return inferTopicCategory(canonicalKey, [titleLower]);
}
