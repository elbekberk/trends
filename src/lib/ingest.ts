import { db } from "@/src/lib/db";
import { isWeakParentKey, resolveCanonicalParent } from "@/src/lib/canonicalParents";

type SourcePost = {
  source: "reddit" | "hn";
  externalId: string;
  title: string;
  url: string | null;
  createdAt: Date | null;
};

const SOURCE_CONFIG = {
  reddit: {
    subreddits: [
      "technology",
      "worldnews",
      "news",
      "geopolitics",
      "economics",
      "futurology",
      "singularity",
    ],
    listings: ["hot", "new", "rising"] as const,
    limit: 15,
    userAgent: "trend-mvp/0.1",
  },
  hn: {
    storyLists: ["topstories", "newstories", "beststories"] as const,
    limit: 20,
  },
};

const STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "this",
  "that",
  "you",
  "your",
  "from",
  "are",
  "was",
  "were",
  "have",
  "has",
  "had",
  "not",
  "but",
  "about",
  "into",
  "just",
  "how",
  "why",
  "what",
  "when",
  "where",
  "who",
  "they",
  "their",
  "its",
  "our",
  "out",
  "new",
  "all",
  "get",
  "can",
  "will",
  "now",
  "after",
  "over",
  "more",
  "than",
  "says",
  "amid",
]);

const GENERIC_FRAGMENTS = new Set([
  "recent calls",
  "recent update",
  "latest update",
  "breaking news",
  "social media",
  "new report",
]);

const DOMAIN_HINTS = [
  "iran",
  "israel",
  "ukraine",
  "trump",
  "china",
  "ai",
  "openai",
  "chip",
  "economy",
  "inflation",
  "market",
  "oil",
];

const CATEGORY_KEYWORDS = {
  geopolitics: [
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
    "uk",
  ],
  technology: [
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
    "cyber",
    "model",
  ],
  economy: [
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
  ],
} as const;

type PhraseCandidate = {
  key: string;
  label: string;
  size: number;
};

type AssignedTopic = {
  parentKey: string;
  parentLabel: string;
  childKey: string | null;
  childLabel: string | null;
  category: "geopolitics" | "technology" | "economy" | "general";
};

function getBucketTime(input = new Date()): Date {
  const d = new Date(input);
  d.setUTCMinutes(0, 0, 0);
  const hour = d.getUTCHours();
  d.setUTCHours(hour - (hour % 2));
  return d;
}

function normalizeToken(token: string): string {
  let value = token.toLowerCase();
  if (value.length > 5 && value.endsWith("ing")) value = value.slice(0, -3);
  else if (value.length > 4 && value.endsWith("ed")) value = value.slice(0, -2);
  else if (value.length > 4 && value.endsWith("s")) value = value.slice(0, -1);
  return value;
}

function normalizeTitleFingerprint(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function tokenizeTitle(title: string): string[] {
  const cleaned = title.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
  return cleaned
    .split(/\s+/)
    .filter(
      (token) =>
        token.length >= 3 &&
        token.length <= 24 &&
        !STOPWORDS.has(token) &&
        !/^\d+$/.test(token),
    );
}

function toPhraseCandidate(tokens: string[], size: number): PhraseCandidate {
  const label = tokens.join(" ");
  const key = tokens.map(normalizeToken).join(" ");
  return { key, label, size };
}

function extractCandidates(title: string): PhraseCandidate[] {
  const tokens = tokenizeTitle(title);
  const candidates = new Map<string, PhraseCandidate>();

  for (const size of [2, 3]) {
    for (let i = 0; i <= tokens.length - size; i += 1) {
      const candidate = toPhraseCandidate(tokens.slice(i, i + size), size);
      candidates.set(candidate.key, candidate);
    }
  }

  for (let i = 0; i <= tokens.length - 4; i += 1) {
    const fourTokens = tokens.slice(i, i + 4);
    if (fourTokens.every((t) => !STOPWORDS.has(t))) {
      const candidate = toPhraseCandidate(fourTokens, 4);
      candidates.set(candidate.key, candidate);
    }
  }

  return [...candidates.values()];
}

function phraseQualityScore(label: string): number {
  if (GENERIC_FRAGMENTS.has(label)) return -3;
  const words = label.split(" ");
  if (words.length < 2) return -2;
  let score = 0;
  if (words.length === 2 || words.length === 3) score += 2;
  if (words.length === 4) score += 1;
  if (/^[a-z0-9\s]+$/.test(label)) score += 1;
  return score;
}

function hasDomainHint(key: string): boolean {
  return DOMAIN_HINTS.some((hint) => key.includes(hint));
}

function rankParentCandidates(
  candidates: PhraseCandidate[],
  frequencyMap: Map<string, number>,
  sourceSpreadMap: Map<string, Set<SourcePost["source"]>>,
): PhraseCandidate[] {
  const parentCandidates = candidates.filter((c) => c.size === 2 || c.size === 3);
  if (parentCandidates.length === 0) return [];

  const scored = parentCandidates.map((candidate) => {
    const frequency = frequencyMap.get(candidate.key) ?? 0;
    const sourceSpread = sourceSpreadMap.get(candidate.key)?.size ?? 1;
    const hintBonus = hasDomainHint(candidate.key) ? 1 : 0;
    const score =
      phraseQualityScore(candidate.label) * 2 +
      frequency * 1.5 +
      sourceSpread * 1.2 +
      hintBonus;
    return { candidate, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.candidate);
}

function pickParentWithRetries(
  candidates: PhraseCandidate[],
  title: string,
  frequencyMap: Map<string, number>,
  sourceSpreadMap: Map<string, Set<SourcePost["source"]>>,
): { raw: PhraseCandidate; canonical: ReturnType<typeof resolveCanonicalParent> } | null {
  const ranked = rankParentCandidates(candidates, frequencyMap, sourceSpreadMap);
  if (ranked.length === 0) return null;

  const titleLower = title.toLowerCase();
  const normalizedTitleTokens = new Set(tokenizeTitle(title).map(normalizeToken));

  for (const candidate of ranked) {
    const canonical = resolveCanonicalParent(
      candidate.key,
      candidate.label,
      titleLower,
      normalizedTitleTokens,
    );
    if (canonical.matchedTheme) return { raw: candidate, canonical };
  }

  for (const candidate of ranked) {
    const canonical = resolveCanonicalParent(
      candidate.key,
      candidate.label,
      titleLower,
      normalizedTitleTokens,
    );
    if (!isWeakParentKey(candidate.key)) return { raw: candidate, canonical };
  }

  return null;
}

function pickBestChild(
  candidates: PhraseCandidate[],
  parentKey: string,
): PhraseCandidate | null {
  const childCandidates = candidates.filter((c) => c.key !== parentKey);
  let best: { candidate: PhraseCandidate; score: number } | null = null;
  for (const candidate of childCandidates) {
    if (candidate.size === 4 && phraseQualityScore(candidate.label) < 2) continue;
    const score = phraseQualityScore(candidate.label) + (candidate.size === 4 ? 1 : 0);
    if (score < 1) continue;
    if (!best || score > best.score) best = { candidate, score };
  }
  return best?.candidate ?? null;
}

function assignCategory(canonicalOrRawKey: string): AssignedTopic["category"] {
  const k = canonicalOrRawKey.toLowerCase();
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

  if (CATEGORY_KEYWORDS.geopolitics.some((w) => k.includes(w))) return "geopolitics";
  if (CATEGORY_KEYWORDS.technology.some((w) => k.includes(w))) return "technology";
  if (CATEGORY_KEYWORDS.economy.some((w) => k.includes(w))) return "economy";
  return "general";
}

function chooseReadableLabel(labels: string[]): string {
  const counts = new Map<string, number>();
  for (const label of labels) counts.set(label, (counts.get(label) ?? 0) + 1);
  let best = labels[0] ?? "";
  let bestScore = -1;
  for (const [label, count] of counts) {
    const score = count * 5 + phraseQualityScore(label);
    if (score > bestScore) {
      bestScore = score;
      best = label;
    }
  }
  return best;
}

async function fetchRedditPosts() {
  const results: SourcePost[] = [];
  const seen = new Set<string>();
  const listingCounts: Record<string, number> = {};

  for (const subreddit of SOURCE_CONFIG.reddit.subreddits) {
    for (const listing of SOURCE_CONFIG.reddit.listings) {
      const key = `${subreddit}.${listing}`;
      listingCounts[key] = 0;

      const res = await fetch(
        `https://www.reddit.com/r/${subreddit}/${listing}.json?limit=${SOURCE_CONFIG.reddit.limit}`,
        {
          headers: { "User-Agent": SOURCE_CONFIG.reddit.userAgent },
          cache: "no-store",
        },
      );

      if (!res.ok) continue;
      const data = await res.json();
      const posts = data?.data?.children ?? [];

      for (const item of posts) {
        const p = item?.data;
        if (!p?.id || !p?.title) continue;

        const dedupeKey = `reddit:${p.id}`;
        if (seen.has(dedupeKey)) continue;
        seen.add(dedupeKey);

        results.push({
          source: "reddit",
          externalId: String(p.id),
          title: String(p.title),
          url: p.url ? String(p.url) : `https://www.reddit.com${String(p.permalink ?? "")}`,
          createdAt: p.created_utc ? new Date(p.created_utc * 1000) : null,
        });
        listingCounts[key] += 1;
      }
    }
  }

  return {
    posts: results,
    listingCounts,
    dedupedCount: results.length,
  };
}

async function fetchHnPosts() {
  const results: SourcePost[] = [];
  const seen = new Set<string>();
  const listCounts: Record<string, number> = {};

  for (const listType of SOURCE_CONFIG.hn.storyLists) {
    listCounts[listType] = 0;
    const idsRes = await fetch(
      `https://hacker-news.firebaseio.com/v0/${listType}.json`,
      { cache: "no-store" },
    );
    if (!idsRes.ok) continue;

    const ids: number[] = (await idsRes.json()).slice(0, SOURCE_CONFIG.hn.limit);

    for (const id of ids) {
      const dedupeKey = String(id);
      if (seen.has(dedupeKey)) continue;

      const itemRes = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
        { cache: "no-store" },
      );
      if (!itemRes.ok) continue;
      const item = await itemRes.json();
      if (!item?.id || !item?.title || item?.type !== "story") continue;

      seen.add(dedupeKey);
      results.push({
        source: "hn",
        externalId: String(item.id),
        title: String(item.title),
        url: item.url ? String(item.url) : `https://news.ycombinator.com/item?id=${item.id}`,
        createdAt: item.time ? new Date(item.time * 1000) : null,
      });
      listCounts[listType] += 1;
    }
  }

  return {
    posts: results,
    listCounts,
    dedupedCount: results.length,
  };
}

export async function runIngest() {
  const fetchedAt = new Date();
  const bucketTime = getBucketTime(fetchedAt);

  const [redditResult, hnResult] = await Promise.all([
    fetchRedditPosts(),
    fetchHnPosts(),
  ]);
  const redditPosts = redditResult.posts;
  const hnPosts = hnResult.posts;
  const allPosts = [...redditPosts, ...hnPosts];

  const uniqueTitleFingerprint = new Set<string>();
  const prepared: Array<{ post: SourcePost; postId: number; candidates: PhraseCandidate[] }> = [];
  const candidateFrequency = new Map<string, number>();
  const candidateLabels = new Map<string, string[]>();
  const candidateSourceSpread = new Map<string, Set<SourcePost["source"]>>();

  await db.topicHit.deleteMany({ where: { bucketTime } });

  let savedPosts = 0;
  let dedupedByTitle = 0;

  for (const post of allPosts) {
    const fingerprint = normalizeTitleFingerprint(post.title);
    if (uniqueTitleFingerprint.has(fingerprint)) {
      dedupedByTitle += 1;
      continue;
    }
    uniqueTitleFingerprint.add(fingerprint);

    const savedPost = await db.post.upsert({
      where: {
        source_externalId: {
          source: post.source,
          externalId: post.externalId,
        },
      },
      update: {
        title: post.title,
        url: post.url,
        createdAt: post.createdAt,
        fetchedAt,
      },
      create: {
        source: post.source,
        externalId: post.externalId,
        title: post.title,
        url: post.url,
        createdAt: post.createdAt,
        fetchedAt,
      },
    });
    savedPosts += 1;

    const candidates = extractCandidates(post.title);
    prepared.push({ post, postId: savedPost.id, candidates });

    const uniqueCandidates = new Map(candidates.map((c) => [c.key, c]));
    for (const candidate of uniqueCandidates.values()) {
      candidateFrequency.set(candidate.key, (candidateFrequency.get(candidate.key) ?? 0) + 1);
      candidateLabels.set(candidate.key, [
        ...(candidateLabels.get(candidate.key) ?? []),
        candidate.label,
      ]);
      const spread = candidateSourceSpread.get(candidate.key) ?? new Set();
      spread.add(post.source);
      candidateSourceSpread.set(candidate.key, spread);
    }
  }

  let topicHitsSaved = 0;
  for (const item of prepared) {
    const picked = pickParentWithRetries(
      item.candidates,
      item.post.title,
      candidateFrequency,
      candidateSourceSpread,
    );
    if (!picked) continue;

    const parent = picked.raw;
    const canonical = picked.canonical;
    const child = pickBestChild(item.candidates, parent.key);
    const parentLabel = chooseReadableLabel(
      candidateLabels.get(parent.key) ?? [parent.label],
    );
    const childLabel =
      child ? chooseReadableLabel(candidateLabels.get(child.key) ?? [child.label]) : null;

    const assigned: AssignedTopic = {
      parentKey: parent.key,
      parentLabel,
      childKey: child?.key ?? null,
      childLabel,
      category: assignCategory(canonical.canonicalParentKey),
    };

    await db.topicHit.create({
      data: {
        bucketTime,
        category: assigned.category,
        parentKey: assigned.parentKey,
        parentLabel: assigned.parentLabel,
        canonicalParentKey: canonical.canonicalParentKey,
        canonicalParentLabel: canonical.canonicalParentLabel,
        childKey: assigned.childKey,
        childLabel: assigned.childLabel,
        postId: item.postId,
      },
    });
    topicHitsSaved += 1;
  }

  return {
    fetchedAt: fetchedAt.toISOString(),
    bucketTime: bucketTime.toISOString(),
    fetched: {
      reddit: {
        totalUniquePosts: redditResult.dedupedCount,
        bySubredditListing: redditResult.listingCounts,
      },
      hackerNews: {
        totalUniquePosts: hnResult.dedupedCount,
        byListType: hnResult.listCounts,
      },
    }
    ,
    totalUniquePosts: allPosts.length,
    dedupedByTitle,
    savedPosts,
    topicHitsSaved,
  };
}

type TopicHitWithPost = Awaited<ReturnType<typeof db.topicHit.findMany>>[number] & {
  post: {
    source: string;
    title: string;
    url: string | null;
    createdAt: Date | null;
    fetchedAt: Date;
  };
};

function groupByCanonicalParent(rows: TopicHitWithPost[]) {
  const map = new Map<string, TopicHitWithPost[]>();
  for (const row of rows) {
    const key = row.canonicalParentKey ?? row.parentKey;
    map.set(key, [...(map.get(key) ?? []), row]);
  }
  return map;
}

function computeCategoryCounts(topics: Array<{ category: string }>) {
  const counts: Record<string, number> = { geopolitics: 0, technology: 0, economy: 0, general: 0 };
  for (const topic of topics) counts[topic.category] = (counts[topic.category] ?? 0) + 1;
  return counts;
}

function toEvidence(rows: TopicHitWithPost[]) {
  return rows
    .sort((a, b) => {
      const aTime = (a.post.createdAt ?? a.post.fetchedAt).getTime();
      const bTime = (b.post.createdAt ?? b.post.fetchedAt).getTime();
      return bTime - aTime;
    })
    .slice(0, 3)
    .map((row) => ({
      source: row.post.source,
      title: row.post.title,
      timestamp: (row.post.createdAt ?? row.post.fetchedAt).toISOString(),
      url: row.post.url,
    }));
}

function buildChildren(rows: TopicHitWithPost[]) {
  const childMap = new Map<string, TopicHitWithPost[]>();
  for (const row of rows) {
    if (!row.childKey || !row.childLabel) continue;
    const key = `${row.childKey}::${row.childLabel}`;
    childMap.set(key, [...(childMap.get(key) ?? []), row]);
  }
  return [...childMap.entries()]
    .map(([key, childRows]) => {
      const sep = key.indexOf("::");
      const childKey = sep === -1 ? key : key.slice(0, sep);
      const childLabel = sep === -1 ? "" : key.slice(sep + 2);
      return {
        childKey,
        childLabel,
        count: childRows.length,
        evidence: toEvidence(childRows),
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);
}

async function fetchTopicRows(bucketTime: Date) {
  return db.topicHit.findMany({
    where: { bucketTime },
    include: {
      post: {
        select: {
          source: true,
          title: true,
          url: true,
          createdAt: true,
          fetchedAt: true,
        },
      },
    },
  });
}

export async function getRisingTopics(limit = 30) {
  const latest = await db.topicHit.findFirst({
    orderBy: { bucketTime: "desc" },
  });
  if (!latest) {
    return {
      bucketTime: null,
      categories: {},
      topics: [],
      lanes: {
        geopolitics: [],
        technology: [],
        economy: [],
        general: [],
      },
      allTopics: [],
    };
  }

  const currentBucket = latest.bucketTime;
  const previousBucket = new Date(currentBucket.getTime() - 2 * 60 * 60 * 1000);
  const [currentRows, previousRows] = await Promise.all([
    fetchTopicRows(currentBucket),
    fetchTopicRows(previousBucket),
  ]);

  const currentByParent = groupByCanonicalParent(currentRows as TopicHitWithPost[]);
  const previousByParent = groupByCanonicalParent(previousRows as TopicHitWithPost[]);

  const allTopics = [...currentByParent.entries()]
    .map(([parentKey, rows]) => {
      const current = rows.length;
      const previous = previousByParent.get(parentKey)?.length ?? 0;
      const score = current - previous;
      const parentLabel = chooseReadableLabel(
        rows.map((r) => r.canonicalParentLabel ?? r.parentLabel),
      );
      const category = rows[0]?.category ?? "general";
      const sourceBreakdown = rows.reduce(
        (acc, row) => {
          acc[row.post.source] = (acc[row.post.source] ?? 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );
      const lastSeenAt = rows
        .map((r) => r.post.createdAt ?? r.post.fetchedAt)
        .sort((a, b) => b.getTime() - a.getTime())[0]
        ?.toISOString();

      return {
        parentKey,
        parentLabel,
        category,
        current,
        previous,
        score,
        sourceBreakdown,
        lastSeenAt: lastSeenAt ?? null,
        children: buildChildren(rows),
      };
    })
    .sort((a, b) => b.score - a.score || b.current - a.current);

  const topics = allTopics.slice(0, limit);

  const lanes = {
    geopolitics: allTopics.filter((t) => t.category === "geopolitics").slice(0, 5),
    technology: allTopics.filter((t) => t.category === "technology").slice(0, 5),
    economy: allTopics.filter((t) => t.category === "economy").slice(0, 5),
    general: allTopics.filter((t) => t.category === "general").slice(0, 5),
  };

  return {
    bucketTime: currentBucket.toISOString(),
    categories: computeCategoryCounts(allTopics),
    topics,
    lanes,
    allTopics,
  };
}
