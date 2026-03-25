/**
 * Canonical key normalization and aggressive parent-key merging for display/radar grouping.
 */

export const CANONICAL_MERGE_MODE = "aggressive" as const;

/** Primary canonical token → surface variants (lowercased phrases / tokens). */
export const TOPIC_ALIASES: Record<string, readonly string[]> = {
  us: ["united states", "u.s", "usa"],
  eu: ["european union"],
  ai: ["artificial intelligence"],
  uk: ["united kingdom"],
};

function buildVariantToCanonical(): Map<string, string> {
  const m = new Map<string, string>();
  for (const [canonical, variants] of Object.entries(TOPIC_ALIASES)) {
    m.set(canonical, canonical);
    for (const v of variants) {
      m.set(v.replace(/\s+/g, " ").trim().toLowerCase(), canonical);
    }
  }
  return m;
}

const VARIANT_TO_CANONICAL = buildVariantToCanonical();

/** Multi-word / punctuation variants applied before tokenization. */
const PHRASE_REPLACEMENTS: Array<{ pattern: RegExp; replace: string }> = [
  { pattern: /\bu\.?\s*s\.?\s*a\.?\b/gi, replace: " us " },
  { pattern: /\bu\.?\s*s\.?\b/gi, replace: " us " },
  { pattern: /\bunited\s+states\b/gi, replace: " us " },
  { pattern: /\beuropean\s+union\b/gi, replace: " eu " },
  { pattern: /\bartificial\s+intelligence\b/gi, replace: " ai " },
  { pattern: /\bunited\s+kingdom\b/gi, replace: " uk " },
];

/**
 * Lowercase, strip punctuation, collapse spaces, simple plural strip (token length > 4),
 * common geopolitical/tech variants, and alias table normalization.
 */
export function normalizeTopicKey(input: string): string {
  let s = input.toLowerCase().trim();
  if (!s) return "";

  for (const { pattern, replace } of PHRASE_REPLACEMENTS) {
    s = s.replace(pattern, replace);
  }

  s = s.replace(/[^a-z0-9\s]/g, " ");
  s = s.replace(/\s+/g, " ").trim();

  const rawTokens = s.split(" ").filter(Boolean);
  const tokens: string[] = [];
  for (const t of rawTokens) {
    if (t.length <= 1) continue;
    const canon = VARIANT_TO_CANONICAL.get(t) ?? t;
    tokens.push(applyPluralStrip(canon));
  }

  return tokens.join(" ");
}

function applyPluralStrip(token: string): string {
  if (token.length > 4 && token.endsWith("s") && !token.endsWith("ss")) {
    return token.slice(0, -1);
  }
  return token;
}

export function tokensFromNormalizedKey(normalized: string): string[] {
  return normalized.split(/\s+/).filter(Boolean);
}

function tokenOverlapMinRatio(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  if (setA.size === 0 || setB.size === 0) return 0;
  let inter = 0;
  for (const t of setA) {
    if (setB.has(t)) inter += 1;
  }
  return inter / Math.min(setA.size, setB.size);
}

/** Non-overlap path: at least two shared normalized tokens (roots). */
function sharedRootTokens(a: string[], b: string[]): boolean {
  const setA = new Set(a);
  const setB = new Set(b);
  let inter = 0;
  for (const t of setA) {
    if (setB.has(t)) inter += 1;
  }
  return inter >= 2;
}

export function shouldMergeNormalizedKeys(na: string, nb: string): boolean {
  if (na === nb) return true;
  const ta = tokensFromNormalizedKey(na);
  const tb = tokensFromNormalizedKey(nb);
  if (ta.length === 0 || tb.length === 0) return false;
  if (tokenOverlapMinRatio(ta, tb) >= 0.7) return true;
  if (sharedRootTokens(ta, tb)) return true;
  return false;
}

function parentKeyStrength(key: string, label: string): number {
  let s = 0;
  const slugParts = key.split("-").filter(Boolean);
  if (slugParts.length >= 2) s += 12;
  s += Math.min(20, key.length * 0.15);
  s += Math.min(8, label.length * 0.08);
  return s;
}

type UnionFind = Map<string, string>;

function ufFind(uf: UnionFind, x: string): string {
  let p = uf.get(x);
  if (p === undefined) {
    uf.set(x, x);
    return x;
  }
  if (p !== x) {
    const root = ufFind(uf, p);
    uf.set(x, root);
    return root;
  }
  return x;
}

function ufUnion(uf: UnionFind, a: string, b: string): void {
  const ra = ufFind(uf, a);
  const rb = ufFind(uf, b);
  if (ra === rb) return;
  uf.set(rb, ra);
}

/**
 * Given display parent keys in one bucket, merge similar ones and map each key → representative (stronger) key.
 */
export function buildAggressiveParentMergeMap(
  keys: string[],
  keyToLabel: Map<string, string>,
): Map<string, string> {
  const unique = [...new Set(keys)].filter(Boolean);
  if (unique.length <= 1) {
    return new Map(unique.map((k) => [k, k]));
  }

  const normalized = new Map<string, string>();
  for (const k of unique) {
    normalized.set(k, normalizeTopicKey(k.replace(/-/g, " ")));
  }

  const uf: UnionFind = new Map();

  for (let i = 0; i < unique.length; i += 1) {
    for (let j = i + 1; j < unique.length; j += 1) {
      const a = unique[i]!;
      const b = unique[j]!;
      const na = normalized.get(a) ?? "";
      const nb = normalized.get(b) ?? "";
      if (shouldMergeNormalizedKeys(na, nb)) {
        ufUnion(uf, a, b);
      }
    }
  }

  const components = new Map<string, string[]>();
  for (const k of unique) {
    const root = ufFind(uf, k);
    components.set(root, [...(components.get(root) ?? []), k]);
  }

  const mergeMap = new Map<string, string>();
  for (const [, group] of components) {
    let best = group[0]!;
    let bestScore = parentKeyStrength(best, keyToLabel.get(best) ?? best);
    for (const k of group.slice(1)) {
      const sc = parentKeyStrength(k, keyToLabel.get(k) ?? k);
      if (sc > bestScore || (sc === bestScore && k.length > best.length)) {
        best = k;
        bestScore = sc;
      }
    }
    for (const k of group) {
      mergeMap.set(k, best);
    }
  }

  return mergeMap;
}
