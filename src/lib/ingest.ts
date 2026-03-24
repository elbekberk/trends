import { db } from "@/src/lib/db";
import {
  formatFallbackParentLabel,
  GENERAL_DISCOURSE_PARENT_KEY,
  GENERAL_DISCOURSE_PARENT_LABEL,
  isWeakParentKey,
  matchMajorTheme,
  resolveCanonicalParent,
} from "@/src/lib/canonicalParents";
import { computeParentTopicMetrics } from "@/src/lib/topicScore";
import {
  assignCategoryFromKeyAndTitle,
  displayParentForRow,
  groupRowsByDisplayParent,
  inferTopicCategory,
  type TopicCategory,
} from "@/src/lib/topicMerge";

/** Which Reddit pool a post was first ingested from (for stats only). */
export type RedditSourcePool = "technology" | "economy" | "geopolitics" | "general";

export type RedditListing = "hot" | "new" | "rising";

export type RedditFetchMeta = {
  pool: RedditSourcePool;
  subreddit: string;
  listing: RedditListing;
};

type SourcePost = {
  source: "reddit" | "hn";
  externalId: string;
  title: string;
  url: string | null;
  createdAt: Date | null;
  /** Set for Reddit posts — used for ingest breakdown by pool/subreddit/listing. */
  redditMeta?: RedditFetchMeta;
};

/**
 * Central Reddit source config: tune subreddit lists per high-level pool here only.
 * Each subreddit is fetched for hot / new / rising (see `listings`) with per-listing limits.
 *
 * Noise / volume: adjust `limitsByListing`, remove a subreddit, or trim `listings`
 * — do not add alternate listing types without updating fetch loops.
 */
const SOURCE_CONFIG = {
  reddit: {
    /** Subreddits grouped by the topic lane we want more coverage for (not the post `category` field). */
    pools: {
      technology: [
        "technology",
        "programming",
        "MachineLearning",
        "artificial",
        "OpenAI",
        "LocalLLaMA",
        "cybersecurity",
        "hardware",
        "Futurology",
        "singularity",
        "ChatGPT",
        "DataScience",
        "netsec",
        "gadgets",
        "buildapc",
        "webdev",
        "devops",
        "startups",
        "SaaS",
        "SideProject",
        "Entrepreneur",
        "NoCode",
        "electricvehicles",
        "teslamotors",
        "space",
        "nuclear",
      ],
      economy: [
        "economics",
        "business",
        "finance",
        "stocks",
        "energy",
        "investing",
        "wallstreetbets",
        "StockMarket",
        "CryptoCurrency",
        "Bitcoin",
        "RealEstate",
        "PersonalFinance",
        "fluentinfinance",
        "EconomicCollapse",
        "REBubble",
        "Options",
      ],
      geopolitics: [
        "worldnews",
        "geopolitics",
        "news",
        "europe",
        "CredibleDefense",
        "inthenews",
        "CombatFootage",
        "UkraineWarVideoReport",
        "LessCredibleDefence",
        "EndlessWar",
        "WarCollege",
        "InternationalNews",
        "China",
        "Russia",
        "MiddleEast",
        "europeanunion",
        "PoliticalDiscussion",
        "GlobalTalk",
        "WorldEvents",
        "anime_titties",
      ],
      general: [
        "OutOfTheLoop",
        "NoStupidQuestions",
        "TooAfraidToAsk",
        "AskReddit",
        "popular",
        "trending",
        "TrueOffMyChest",
        "AmItheAsshole",
        "relationship_advice",
        "confession",
        "todayilearned",
        "interestingasfuck",
      ],
    } satisfies Record<RedditSourcePool, readonly string[]>,
    listings: ["hot", "new", "rising"] as const,
    /** Reddit JSON `limit` per listing type (≈20 posts max per subreddit before dedupe). */
    limitsByListing: {
      hot: 8,
      new: 8,
      rising: 4,
    } satisfies Record<RedditListing, number>,
    userAgent: "trend-mvp/0.1",
  },
  hn: {
    storyLists: ["topstories", "newstories", "beststories"] as const,
    limit: 20,
  },
} as const;

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

type PhraseCandidate = {
  key: string;
  label: string;
  size: number;
};

type AssignedTopic = {
  parentKey: string;
  parentLabel: string;
  canonicalParentKey: string;
  canonicalParentLabel: string;
  childKey: string | null;
  childLabel: string | null;
  category: TopicCategory;
};

/** Max child developments shown per parent (phrase + merge fragments). */
const MAX_CHILDREN_PER_PARENT = 5;

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

/**
 * Always prefers a strong top-level parent: themed canonical, non-weak phrase, anchor merge, or general-discourse.
 * Never drops the post when phrase candidates exist.
 */
function pickParentForPost(
  candidates: PhraseCandidate[],
  title: string,
  frequencyMap: Map<string, number>,
  sourceSpreadMap: Map<string, Set<SourcePost["source"]>>,
  candidateLabels: Map<string, string[]>,
): AssignedTopic | null {
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
    if (canonical.matchedTheme) {
      if (isWeakParentKey(candidate.key)) {
        const childLabel = formatFallbackParentLabel(
          chooseReadableLabel(candidateLabels.get(candidate.key) ?? [candidate.label]),
        );
        return {
          parentKey: canonical.canonicalParentKey,
          parentLabel: canonical.canonicalParentLabel,
          canonicalParentKey: canonical.canonicalParentKey,
          canonicalParentLabel: canonical.canonicalParentLabel,
          childKey: candidate.key,
          childLabel,
          category: assignCategoryFromKeyAndTitle(canonical.canonicalParentKey, titleLower),
        };
      }
      const child = pickBestChild(candidates, candidate.key);
      const parentLabel = chooseReadableLabel(
        candidateLabels.get(candidate.key) ?? [candidate.label],
      );
      const childLabel = child
        ? chooseReadableLabel(candidateLabels.get(child.key) ?? [child.label])
        : null;
      return {
        parentKey: candidate.key,
        parentLabel,
        canonicalParentKey: canonical.canonicalParentKey,
        canonicalParentLabel: canonical.canonicalParentLabel,
        childKey: child?.key ?? null,
        childLabel,
        category: assignCategoryFromKeyAndTitle(canonical.canonicalParentKey, titleLower),
      };
    }
  }

  for (const candidate of ranked) {
    if (!isWeakParentKey(candidate.key)) {
      const canonical = resolveCanonicalParent(
        candidate.key,
        candidate.label,
        titleLower,
        normalizedTitleTokens,
      );
      const child = pickBestChild(candidates, candidate.key);
      const parentLabel = chooseReadableLabel(
        candidateLabels.get(candidate.key) ?? [candidate.label],
      );
      const childLabel = child
        ? chooseReadableLabel(candidateLabels.get(child.key) ?? [child.label])
        : null;
      return {
        parentKey: candidate.key,
        parentLabel,
        canonicalParentKey: canonical.canonicalParentKey,
        canonicalParentLabel: canonical.canonicalParentLabel,
        childKey: child?.key ?? null,
        childLabel,
        category: assignCategoryFromKeyAndTitle(canonical.canonicalParentKey, titleLower),
      };
    }
  }

  for (const candidate of ranked) {
    const themed = matchMajorTheme(candidate.key, titleLower, normalizedTitleTokens);
    if (themed) {
      const childLabel = formatFallbackParentLabel(
        chooseReadableLabel(candidateLabels.get(candidate.key) ?? [candidate.label]),
      );
      return {
        parentKey: themed.canonicalParentKey,
        parentLabel: themed.canonicalParentLabel,
        canonicalParentKey: themed.canonicalParentKey,
        canonicalParentLabel: themed.canonicalParentLabel,
        childKey: candidate.key,
        childLabel,
        category: assignCategoryFromKeyAndTitle(themed.canonicalParentKey, titleLower),
      };
    }
  }

  const strong = ranked.find((c) => !isWeakParentKey(c.key));
  const weak = ranked[0];
  if (strong && weak && weak.key !== strong.key) {
    const canonical = resolveCanonicalParent(
      strong.key,
      strong.label,
      titleLower,
      normalizedTitleTokens,
    );
    const childLabel = formatFallbackParentLabel(
      chooseReadableLabel(candidateLabels.get(weak.key) ?? [weak.label]),
    );
    return {
      parentKey: canonical.canonicalParentKey,
      parentLabel: canonical.canonicalParentLabel,
      canonicalParentKey: canonical.canonicalParentKey,
      canonicalParentLabel: canonical.canonicalParentLabel,
      childKey: weak.key,
      childLabel,
      category: assignCategoryFromKeyAndTitle(canonical.canonicalParentKey, titleLower),
    };
  }

  const w = ranked[0];
  const childLabel = formatFallbackParentLabel(
    chooseReadableLabel(candidateLabels.get(w.key) ?? [w.label]),
  );
  return {
    parentKey: GENERAL_DISCOURSE_PARENT_KEY,
    parentLabel: GENERAL_DISCOURSE_PARENT_LABEL,
    canonicalParentKey: GENERAL_DISCOURSE_PARENT_KEY,
    canonicalParentLabel: GENERAL_DISCOURSE_PARENT_LABEL,
    childKey: w.key,
    childLabel,
    category: assignCategoryFromKeyAndTitle(GENERAL_DISCOURSE_PARENT_KEY, titleLower),
  };
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
  /** Flat: `pool.subreddit.listing` → posts first attributed to that fetch (after dedupe). */
  const listingCounts: Record<string, number> = {};
  const byPool: Record<
    RedditSourcePool,
    { bySubredditListing: Record<string, number>; uniquePosts: number }
  > = {
    technology: { bySubredditListing: {}, uniquePosts: 0 },
    economy: { bySubredditListing: {}, uniquePosts: 0 },
    geopolitics: { bySubredditListing: {}, uniquePosts: 0 },
    general: { bySubredditListing: {}, uniquePosts: 0 },
  };

  const pools = SOURCE_CONFIG.reddit.pools;
  const limitsByListing = SOURCE_CONFIG.reddit.limitsByListing;
  for (const pool of Object.keys(pools) as RedditSourcePool[]) {
    for (const subreddit of pools[pool]) {
      for (const listing of SOURCE_CONFIG.reddit.listings) {
        const flatKey = `${pool}.${subreddit}.${listing}`;
        const subListingKey = `${subreddit}.${listing}`;
        listingCounts[flatKey] = 0;

        const limit = limitsByListing[listing];
        const res = await fetch(
          `https://www.reddit.com/r/${subreddit}/${listing}.json?limit=${limit}`,
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
            redditMeta: { pool, subreddit, listing },
          });
          listingCounts[flatKey] += 1;
          byPool[pool].bySubredditListing[subListingKey] =
            (byPool[pool].bySubredditListing[subListingKey] ?? 0) + 1;
          byPool[pool].uniquePosts += 1;
        }
      }
    }
  }

  let fetchAttempts = 0;
  for (const pool of Object.keys(pools) as RedditSourcePool[]) {
    fetchAttempts += pools[pool].length * SOURCE_CONFIG.reddit.listings.length;
  }

  const subredditsByPool = {
    technology: pools.technology.length,
    economy: pools.economy.length,
    geopolitics: pools.geopolitics.length,
    general: pools.general.length,
  } satisfies Record<RedditSourcePool, number>;

  return {
    posts: results,
    listingCounts,
    byPool,
    dedupedCount: results.length,
    configSummary: {
      listings: [...SOURCE_CONFIG.reddit.listings],
      limitsByListing: { ...limitsByListing },
      subredditsByPool,
      fetchAttempts,
    },
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
    const assigned = pickParentForPost(
      item.candidates,
      item.post.title,
      candidateFrequency,
      candidateSourceSpread,
      candidateLabels,
    );
    if (!assigned) continue;

    await db.topicHit.create({
      data: {
        bucketTime,
        category: assigned.category,
        parentKey: assigned.parentKey,
        parentLabel: assigned.parentLabel,
        canonicalParentKey: assigned.canonicalParentKey,
        canonicalParentLabel: assigned.canonicalParentLabel,
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
        configSummary: redditResult.configSummary,
        /** Per pool: unique posts first seen from that pool’s subreddits (after cross-pool dedupe). */
        byPool: redditResult.byPool,
        /** Flat map: `pool.subreddit.listing` → posts attributed to that request (dedupe across pools: first win). */
        bySubredditListing: redditResult.listingCounts,
      },
      hackerNews: {
        totalUniquePosts: hnResult.dedupedCount,
        byListType: hnResult.listCounts,
        configSummary: {
          storyLists: [...SOURCE_CONFIG.hn.storyLists],
          limitPerList: SOURCE_CONFIG.hn.limit,
        },
      },
    },
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

function rowOriginalParentKey(row: TopicHitWithPost): string {
  return row.canonicalParentKey ?? row.parentKey;
}

type ChildBlock = {
  childKey: string;
  childLabel: string;
  count: number;
  evidence: ReturnType<typeof toEvidence>;
};

/** Phrase-based children (no cap here — combined step sorts and caps). */
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
    .sort((a, b) => b.count - a.count);
}

/** Original parent keys absorbed into a display merge become extra child rows. */
function mergeFragmentChildren(rows: TopicHitWithPost[], displayKey: string): ChildBlock[] {
  const byKey = new Map<string, TopicHitWithPost[]>();
  for (const row of rows) {
    const ok = rowOriginalParentKey(row);
    if (ok === displayKey) continue;
    byKey.set(ok, [...(byKey.get(ok) ?? []), row]);
  }
  return [...byKey.entries()].map(([childKey, sub]) => ({
    childKey,
    childLabel:
      sub[0]?.canonicalParentLabel ??
      sub[0]?.parentLabel ??
      formatFallbackParentLabel(childKey),
    count: sub.length,
    evidence: toEvidence(sub),
  }));
}

function combineChildrenForParent(rows: TopicHitWithPost[], displayKey: string): ChildBlock[] {
  const phrase = buildChildren(rows);
  const merged = mergeFragmentChildren(rows, displayKey);
  const byChildKey = new Map<string, ChildBlock>();
  for (const c of [...merged, ...phrase]) {
    const prev = byChildKey.get(c.childKey);
    if (!prev) {
      byChildKey.set(c.childKey, { ...c });
      continue;
    }
    prev.count += c.count;
    const seen = new Set<string>();
    prev.evidence = [...prev.evidence, ...c.evidence].filter((e) => {
      const id = `${e.title}|${e.timestamp}`;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
    prev.evidence = prev.evidence.slice(0, 3);
  }
  return [...byChildKey.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, MAX_CHILDREN_PER_PARENT);
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

  const currentByDisplay = groupRowsByDisplayParent(currentRows as TopicHitWithPost[]);
  const previousByDisplay = groupRowsByDisplayParent(previousRows as TopicHitWithPost[]);

  const allTopics = [...currentByDisplay.entries()]
    .map(([parentKey, rows]) => {
      const current = rows.length;
      const previous = previousByDisplay.get(parentKey)?.length ?? 0;
      const { label: parentLabel } = displayParentForRow(rows[0]);
      const titles = rows.map((r) => r.post.title);
      const category = inferTopicCategory(parentKey, titles);
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

      const metrics = computeParentTopicMetrics(current, previous, sourceBreakdown);

      return {
        parentKey,
        parentLabel,
        category,
        current: metrics.current,
        previous: metrics.previous,
        delta: metrics.delta,
        growthRatio: metrics.growthRatio,
        sourceCount: metrics.sourceCount,
        score: metrics.score,
        confidence: metrics.confidence,
        sourceBreakdown,
        lastSeenAt: lastSeenAt ?? null,
        children: combineChildrenForParent(rows, parentKey),
      };
    })
    .filter((t) => t.current >= 3 || t.sourceCount >= 2)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.delta - a.delta ||
        b.current - a.current,
    );

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
