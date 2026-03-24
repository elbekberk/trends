/**
 * Small, focused theme rules for recurring major stories only.
 * Everything else uses readable fallbacks from the raw parent phrase.
 */

export type CanonicalResolution = {
  canonicalParentKey: string;
  canonicalParentLabel: string;
  matchedTheme: boolean;
};

const WEAK_PAIR_KEYS = new Set([
  "foreign made",
  "made outside",
  "outside made",
  "seek trillion",
  "seeks trillion",
]);

const WEAK_TOKEN = new Set([
  "foreign",
  "made",
  "outside",
  "bets",
  "seeks",
  "seek",
  "recent",
  "latest",
  "calls",
  "give",
  "real",
  "post",
  "show",
  "say",
  "says",
  "time",
  "right",
  "push",
  "lower",
  "more",
  "than",
  "after",
  "over",
  "amid",
  "before",
  "during",
  "near",
  "attack",
]);

/** First token in a two-word fragment that usually should not stand alone as a parent. */
const WEAK_FIRST_TOKEN = new Set([
  "before",
  "after",
  "amid",
  "during",
  "near",
  "show",
  "attack",
]);

const PLACE_FRAGMENTS = new Set(["raf", "fairford"]);

const GENERIC_PARENT_FRAGMENTS = new Set([
  "recent calls",
  "recent update",
  "latest update",
  "breaking news",
  "new report",
  "social media",
]);

function titleCasePhrase(label: string): string {
  return label
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/** When no theme matches: keep key as stable id, polish label for display. */
export function formatFallbackParentLabel(rawLabel: string): string {
  const trimmed = rawLabel.trim();
  if (!trimmed) return rawLabel;
  return titleCasePhrase(trimmed);
}

/** Fallback parent when every phrase candidate is too weak and no anchor matches. */
export const GENERAL_DISCOURSE_PARENT_KEY = "general-discourse";
export const GENERAL_DISCOURSE_PARENT_LABEL = "General discourse";

/**
 * Ordered rules: first match wins. Keep this list short and maintainable.
 */
export function matchMajorTheme(
  rawParentKey: string,
  titleLower: string,
  normalizedTitleTokens: Set<string>,
): { canonicalParentKey: string; canonicalParentLabel: string } | null {
  const key = rawParentKey;

  // US / Iran / Gulf — recurring geopolitical cluster
  const iranHit =
    normalizedTitleTokens.has("iran") ||
    key.includes("iran") ||
    titleLower.includes("iran");
  const iranContext =
    /\b(war|attack|strike|missile|hormuz|strait|trump|sanction|oil|gulf|tehran|israel|netanyahu)\b/i.test(
      titleLower,
    ) || /\biran\b.*\b(war|attack|strike)\b/i.test(titleLower);
  if (iranHit && iranContext) {
    return {
      canonicalParentKey: "us-iran-gulf-conflict",
      canonicalParentLabel: "US - Iran conflict",
    };
  }

  // Ukraine / Russia war thread
  const ukraineHit =
    normalizedTitleTokens.has("ukraine") ||
    normalizedTitleTokens.has("russian") ||
    key.includes("ukraine") ||
    key.includes("russia");
  const ukraineContext =
    /\b(war|invasion|crimea|donbas|putin|zelensky|nato)\b/i.test(titleLower);
  if (ukraineHit && ukraineContext) {
    return {
      canonicalParentKey: "ukraine-russia-war",
      canonicalParentLabel: "Ukraine - Russia war",
    };
  }

  // Router / FCC / import bans (tech-policy)
  const routerHit =
    /\brouter(s)?\b/i.test(titleLower) ||
    normalizedTitleTokens.has("router") ||
    normalizedTitleTokens.has("routers");
  const banHit =
    /\b(ban|bans|fcc|import|imports|foreign|consumer)\b/i.test(titleLower);
  if (routerHit && banHit) {
    return {
      canonicalParentKey: "us-router-import-restrictions",
      canonicalParentLabel: "US router import restrictions",
    };
  }

  // Apple antitrust / legal
  const appleHit =
    normalizedTitleTokens.has("apple") || /\bapple\b/i.test(titleLower);
  const legalHit =
    /\b(antitrust|lawsuit|ruling|court|doj|fine)\b/i.test(titleLower);
  if (appleHit && legalHit) {
    return {
      canonicalParentKey: "apple-antitrust-legal",
      canonicalParentLabel: "Apple antitrust",
    };
  }

  // Oil / energy markets (economy lane)
  const oilHit =
    /\b(oil|crude|opec|barrel|gasoline)\b/i.test(titleLower) ||
    normalizedTitleTokens.has("oil");
  const marketHit =
    /\b(market|price|prices|surge|crash|barrel|energy)\b/i.test(titleLower);
  if (oilHit && marketHit) {
    return {
      canonicalParentKey: "oil-energy-markets",
      canonicalParentLabel: "Oil and energy markets",
    };
  }

  return null;
}

/**
 * Raw parent key is "too fragment-like" to stand alone unless a major theme matches elsewhere.
 */
export function isWeakParentKey(rawParentKey: string): boolean {
  const k = rawParentKey.toLowerCase().trim();
  if (GENERIC_PARENT_FRAGMENTS.has(k)) return true;
  if (WEAK_PAIR_KEYS.has(k)) return true;

  const parts = k.split(/\s+/).filter(Boolean);

  if (parts.length === 2 && WEAK_FIRST_TOKEN.has(parts[0])) {
    return true;
  }

  if (parts.length === 2) {
    const hasPlace = parts.some((p) => PLACE_FRAGMENTS.has(p));
    const otherGeneric =
      parts.some((p) => WEAK_TOKEN.has(p) || WEAK_FIRST_TOKEN.has(p)) ||
      parts.some((p) => p === "near" || p === "base");
    if (hasPlace && otherGeneric) return true;
  }

  if (parts.length >= 2) {
    const allWeak = parts.every((p) => WEAK_TOKEN.has(p));
    if (allWeak) return true;
  }

  // e.g. "attack iran" / "bets iran" — fragmenty; theme layer should absorb these
  if (
    parts.length === 2 &&
    (parts[0] === "attack" || parts[0] === "bets" || parts[0] === "seek") &&
    parts[1] === "iran"
  ) {
    return true;
  }

  return false;
}

export function resolveCanonicalParent(
  rawParentKey: string,
  rawParentLabel: string,
  titleLower: string,
  normalizedTitleTokens: Set<string>,
): CanonicalResolution {
  const themed = matchMajorTheme(rawParentKey, titleLower, normalizedTitleTokens);
  if (themed) {
    return {
      canonicalParentKey: themed.canonicalParentKey,
      canonicalParentLabel: themed.canonicalParentLabel,
      matchedTheme: true,
    };
  }

  return {
    canonicalParentKey: rawParentKey,
    canonicalParentLabel: formatFallbackParentLabel(rawParentLabel),
    matchedTheme: false,
  };
}
