import { db } from "@/src/lib/db";
import {
  formatFallbackParentLabel,
  GENERAL_DISCOURSE_PARENT_KEY,
  GENERAL_DISCOURSE_PARENT_LABEL,
  isWeakParentKey,
  matchMajorTheme,
  resolveCanonicalParent,
} from "@/src/lib/canonicalParents";
import {
  computeParentTopicMetrics,
  computeParentTopicScoreComponents,
  DISCUSSION_SCORING_NOTE,
  discussionScoreContribution,
  scoreWithDiscussionBonus,
  type TopicConfidence,
} from "@/src/lib/topicScore";
import {
  assignCategoryFromKeyAndTitle,
  displayParentForRow,
  groupRowsByMergedDisplayParent,
  inferTopicCategory,
  type TopicCategory,
} from "@/src/lib/topicMerge";
import { CANONICAL_MERGE_MODE } from "@/src/lib/topicNormalize";
import {
  type RedditApiClient,
  type RedditClientExtras,
  type RedditHttpStats,
  recordRedditHttpAttempt,
} from "@/src/lib/reddit";
import { buildSignalsFromStats, computeNextAdaptiveBudget } from "@/src/lib/reddit/adaptiveBudget";
import {
  LANE_ORDER,
  loadRedditCollectorState,
  neutralizeStaleLaneStateIfNoHttp,
  resetRedditCollectorForFreshCycle,
  type RedditCollectorState,
  saveRedditCollectorState,
} from "@/src/lib/reddit/collectorState";
import { loadRedditIngestEnv, type RedditIngestEnv } from "@/src/lib/reddit/redditEnv";
import type { RedditHttpBudgetGate } from "@/src/lib/reddit/redditBudgetGate";
import { runRedditListingFetchPhase } from "@/src/lib/reddit/redditListingFetch";
import { shouldFetchCommentSnippets } from "@/src/lib/reddit/redditCommentPolicy";

/** Debug: strict candidate / parent filtering (topic labels). */
export const CANDIDATE_FILTER_MODE = "strict" as const;

export type { RedditHttpStats } from "@/src/lib/reddit/redditClient";

export type TopicScoreBreakdown = {
  deltaContribution: number;
  growthContribution: number;
  sourceSpreadContribution: number;
  discussionContribution: number;
  totalScore: number;
};

export type TopicAnalytics = {
  current: number;
  previous: number;
  delta: number;
  growthRatio: number;
  sourceCount: number;
  sourceBreakdown: Record<string, number>;
  confidence: TopicConfidence;
  score: number;
  discussionScore: number;
  totalRedditScore: number;
  totalNumComments: number;
  sampledCommentCount: number;
  discussionKeywords: string[];
  canonicalParentKey: string | null;
  canonicalParentLabel: string | null;
  displayParentKey: string;
  displayParentLabel: string;
  mergedParentFragments: Array<{ key: string; label: string; count: number }>;
  childCount: number;
  evidenceCount: number;
  lastSeenAt: string | null;
  scoreBreakdown: TopicScoreBreakdown;
  /** How discussion enters the total score (human-readable; matches `topicScore` rules). */
  discussionScoringNote: string;
  sampleComments: string[];
};

/** Persisted + returned from `runIngest` for the health panel. */
export type IngestHealthSnapshot = {
  lastIngestAt: string;
  bucketTime: string;
  redditOnlyMode: boolean;
  candidateFilterMode: string;
  canonicalMergeMode: string;
  totalRedditRequests: number;
  successfulRedditRequests: number;
  failedRedditRequests: number;
  emptyResponses: number;
  statusCounts: Record<string, number>;
  lowDataWarning: boolean;
  highFailureRateWarning: boolean;
  rateLimitWarning: boolean;
  authIssueWarning: boolean;
  redditPostsFetched: number;
  /** HTTP attempts to fetch `/comments/{id}.json` (after title dedupe). */
  commentsFetched: number;
  /** Total `{ body }` snippets written to `Post.commentsJson` this ingest. */
  commentsUsed: number;
  /** Same as `commentsUsed` (explicit count for observability). */
  snippetsStored: number;
  /** Alias of `commentsFetched` (comment-thread HTTP attempts). */
  commentSnippetFetchAttempts: number;
  commentSnippetFetchFailures: number;
  topicHitsSaved: number;
  savedPosts: number;
  dedupedByTitle: number;
  redditListingRequestAttempts: number;
  fetchAttemptsByPool: Record<string, number>;
  redditUniquePostsByPool: Record<string, number>;
  hnPostCountFetched: number;
  /** Reddit rate / OAuth observability (additive; older snapshots may omit fields). */
  redditTargetQpm?: number;
  redditWindowMinutes?: number;
  redditActualRequestCount?: number;
  redditSelectedSubreddits?: string[];
  redditSkippedSubreddits?: string[];
  redditBackoffTriggered?: boolean;
  rateLimitHeadersSeen?: Record<string, string> | null;
  redditOAuthConfigured?: boolean;
  redditOAuthInUse?: boolean;
  redditOAuthWarning?: boolean;
  /** Interim: listings used www.reddit.com JSON without OAuth. */
  redditPublicFallbackUsed?: boolean;
  /** Interim adaptive collector (see `collectorState.ts`). */
  budgetMode?: "adaptive";
  currentAdaptiveBudget?: number;
  previousAdaptiveBudget?: number;
  minRequestBudget?: number;
  maxRequestBudget?: number;
  successRate?: number;
  failureRate?: number;
  http429Count?: number;
  authErrorCount?: number;
  emptyResponseCount?: number;
  budgetChangeReason?: string;
  globalBackoffActive?: boolean;
  lanePenalty?: Record<string, number>;
  pausedDueToBudget?: boolean;
  pausedDueTo429?: boolean;
  currentCycleStatus?: string;
  refreshedAt?: string | null;
  /** Last successful ingest snapshot write (UTC ISO). */
  lastPublishAt?: string | null;
  nextPublishEligibility?: string | null;
  completedLanes?: string[];
  failedLanes?: string[];
  /** Lanes not finished because budget ran out or not reached yet (not HTTP failure). */
  deferredLanes?: string[];
  /** Lanes not completed this cycle (expected − completed). */
  missingLanes?: string[];
  collectorCycleId?: string;
  commentHttpBudgetUsed?: number;
  /** Set only for manual reset/wipe snapshots (not a full ingest run). */
  healthSnapshotReason?: "collector_reset" | "testing_full_wipe" | "budget_reset";
  /** Present after reset/clear baseline snapshots — UI shows neutral copy instead of treating as failed collect. */
  healthNeutralHint?: "cycle_reset" | "history_cleared" | "budget_reset";
  /** Interim: forced public JSON mode (see REDDIT_PUBLIC_FALLBACK_ONLY). */
  redditPublicFallbackOnly?: boolean;
  /** Human-readable collector mode for the health panel. */
  collectorModeLabel?: string | null;
  /** When listing phase skipped (backoff / next_eligible) before any HTTP. */
  listingSkippedReason?: string | null;
  /** This health object is from a run that did not write a new ingest snapshot row. */
  ingestRunDidNotPublishSnapshot?: boolean;
  ingestSkipPublishReason?: string | null;
};

import type { RedditDiscussionFields, RedditListing, RedditSourcePool, SourcePost } from "@/src/lib/reddit/types";
import { parseRedditListing, redditThreadUrl } from "@/src/lib/reddit/parseListing";

export type { RedditDiscussionFields, RedditListing, RedditSourcePool, SourcePost } from "@/src/lib/reddit/types";

/** Bound selftext fed into phrase extraction (stored Post.selftext unchanged). */
const EXTRACT_SELFTEXT_MAX = 500;

/** Reddit JSON `limit` on thread fetch (small tree only). */
const REDDIT_COMMENT_FETCH_LIMIT = 8;
/** Max snippets persisted per post. */
const REDDIT_COMMENT_STORE_MAX = 3;
/** Character cap per stored comment body. */
const REDDIT_COMMENT_MAX_CHARS = 300;

/** Strip unsafe control chars; trim; collapse internal whitespace. */
function sanitizeCommentBody(raw: string): string {
  let s = raw.replace(/\u0000/g, "").trim();
  s = s.replace(/[\u0001-\u0008\u000b\u000c\u000e-\u001f]/g, "");
  s = s.replace(/\s+/g, " ");
  return s.trim();
}

function discussionTextForExtraction(post: SourcePost): string {
  if (post.source !== "reddit" || !post.reddit) return post.title;
  const st = post.reddit.selftext.trim();
  if (!st) return post.title;
  const cap =
    st.length > EXTRACT_SELFTEXT_MAX ? `${st.slice(0, EXTRACT_SELFTEXT_MAX)}` : st;
  return `${post.title}\n${cap}`;
}

function prismaPostData(post: SourcePost, fetchedAt: Date) {
  if (post.source === "reddit" && post.reddit) {
    const r = post.reddit;
    const snippets = post.redditComments?.slice(0, REDDIT_COMMENT_STORE_MAX) ?? [];
    const commentsJson =
      snippets.length > 0 ? JSON.stringify(snippets) : null;
    return {
      title: post.title,
      url: post.url,
      createdAt: post.createdAt,
      fetchedAt,
      externalUrl: r.externalUrl,
      selftext: r.selftext.length > 0 ? r.selftext : null,
      redditScore: r.score,
      numComments: r.numComments,
      subreddit: r.subreddit,
      redditListing: r.listing,
      redditPool: r.pool,
      linkDomain: r.domain,
      isSelf: r.isSelf,
      commentsJson,
    };
  }
  return {
    title: post.title,
    url: post.url,
    createdAt: post.createdAt,
    fetchedAt,
    externalUrl: null,
    selftext: null,
    redditScore: null,
    numComments: null,
    subreddit: null,
    redditListing: null,
    redditPool: null,
    linkDomain: null,
    isSelf: null,
    commentsJson: null,
  };
}

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
  // URL / platform junk (tokenized)
  "http",
  "https",
  "www",
  "com",
  "org",
  "net",
  "reddit",
  "comments",
  "imgur",
  "youtube",
  "youtu",
  "tiktok",
  "twitter",
  "xcom",
  // conversational filler / weak verbs / pronoun-ish
  "don",
  "dont",
  "know",
  "think",
  "feel",
  "like",
  "make",
  "made",
  "want",
  "asking",
  "ask",
  "question",
  "anyone",
  "someone",
  "everybody",
  "anybody",
  "thing",
  "things",
  "stuff",
  "maybe",
  "really",
  "going",
  "getting",
  "got",
  "ive",
  "im",
  "youre",
  "thats",
  "theres",
  "doesnt",
  "didnt",
  "cant",
  "wont",
  "should",
  "could",
  "would",
  // generic discussion
  "post",
  "thread",
  "title",
  "update",
  "story",
  "article",
  "video",
  "link",
  "source",
]);

/** Stricter ask-a-question / vent subs: parent phrases need a theme signal or domain hint. */
const STRICT_GENERAL_SUBREDDITS = new Set(
  [
    "AskReddit",
    "NoStupidQuestions",
    "TooAfraidToAsk",
    "TrueOffMyChest",
    "relationship_advice",
    "confession",
  ].map((s) => s.toLowerCase()),
);

const JUNK_EDGE_START = new Set([
  "don",
  "dont",
  "know",
  "think",
  "feel",
  "like",
  "just",
  "maybe",
  "really",
  "anyone",
  "someone",
  "asking",
  "ask",
  "what",
  "why",
  "how",
  "when",
  "where",
  "who",
]);

const JUNK_EDGE_END = new Set([
  "know",
  "think",
  "like",
  "maybe",
  "really",
  "anyone",
  "someone",
  "thing",
  "things",
  "stuff",
]);

const GENERIC_FILLER_TOKENS = new Set([
  ...STOPWORDS,
  "been",
  "being",
  "also",
  "even",
  "still",
  "well",
  "much",
  "many",
  "some",
  "such",
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

/** 2-hour UTC bucket used by ingest topic runs (exported for API/tests). */
export function getIngestBucketTime(input = new Date()): Date {
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

function extractCandidatesFromText(text: string): PhraseCandidate[] {
  const tokens = tokenizeTitle(text);
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

const URL_JUNK_RE =
  /\b(https?|www|\.com|\.org|\.net|reddit|imgur|youtube|youtu|tiktok|twitter|xcom)\b/i;

/** Central junk / low-signal phrase detection for parent labels. */
function isJunkPhrase(keyOrLabel: string): boolean {
  const s = keyOrLabel.toLowerCase().trim();
  if (!s) return true;
  if (URL_JUNK_RE.test(s)) return true;
  if (/^https?:\/\//i.test(s)) return true;
  return false;
}

function isGenericOnlyParentKey(key: string): boolean {
  const parts = key.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return true;
  return parts.every((p) => GENERIC_FILLER_TOKENS.has(p));
}

function isLowQualityParentPhrase(key: string): boolean {
  const parts = key.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return true;
  if (parts.every((p) => GENERIC_FILLER_TOKENS.has(p))) return true;
  const first = parts[0];
  const last = parts[parts.length - 1];
  if (JUNK_EDGE_START.has(first) || JUNK_EDGE_END.has(last)) return true;
  if (parts.length >= 2 && parts[0] === "don" && parts[1] === "know") return true;
  if (parts.length <= 3 && ["ask", "why", "what", "how"].includes(first)) return true;
  return false;
}

function isStrictGeneralSubreddit(name: string): boolean {
  return STRICT_GENERAL_SUBREDDITS.has(name.toLowerCase());
}

function passesStrictParentGate(
  c: PhraseCandidate,
  titleLower: string,
  normalizedTokens: Set<string>,
): boolean {
  if (hasDomainHint(c.key)) return true;
  return matchMajorTheme(c.key, titleLower, normalizedTokens) !== null;
}

function filterParentCandidatesForRanking(
  candidates: PhraseCandidate[],
  post: SourcePost | undefined,
): PhraseCandidate[] {
  const base = candidates.filter(
    (c) =>
      (c.size === 2 || c.size === 3) &&
      !isJunkPhrase(c.key) &&
      !isJunkPhrase(c.label) &&
      !isLowQualityParentPhrase(c.key) &&
      !isGenericOnlyParentKey(c.key) &&
      phraseQualityScore(c.label) > 0,
  );
  if (post?.reddit && isStrictGeneralSubreddit(post.reddit.subreddit)) {
    const blob = discussionTextForExtraction(post);
    const titleLower = blob.toLowerCase();
    const nt = new Set(tokenizeTitle(blob).map(normalizeToken));
    return base.filter((c) => passesStrictParentGate(c, titleLower, nt));
  }
  return base;
}

function rankParentCandidates(
  candidates: PhraseCandidate[],
  frequencyMap: Map<string, number>,
  sourceSpreadMap: Map<string, Set<SourcePost["source"]>>,
  post?: SourcePost,
): PhraseCandidate[] {
  const parentCandidates = filterParentCandidatesForRanking(candidates, post);
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
  post: SourcePost,
): AssignedTopic | null {
  const ranked = rankParentCandidates(candidates, frequencyMap, sourceSpreadMap, post);
  if (ranked.length === 0) {
    if (candidates.length === 0) return null;
    const titleLower = title.toLowerCase();
    return {
      parentKey: GENERAL_DISCOURSE_PARENT_KEY,
      parentLabel: GENERAL_DISCOURSE_PARENT_LABEL,
      canonicalParentKey: GENERAL_DISCOURSE_PARENT_KEY,
      canonicalParentLabel: GENERAL_DISCOURSE_PARENT_LABEL,
      childKey: null,
      childLabel: null,
      category: assignCategoryFromKeyAndTitle(GENERAL_DISCOURSE_PARENT_KEY, titleLower),
    };
  }

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
      const phraseChildLabel = formatFallbackParentLabel(
        chooseReadableLabel(candidateLabels.get(candidate.key) ?? [candidate.label]),
      );
      return {
        parentKey: canonical.canonicalParentKey,
        parentLabel: canonical.canonicalParentLabel,
        canonicalParentKey: canonical.canonicalParentKey,
        canonicalParentLabel: canonical.canonicalParentLabel,
        childKey: candidate.key,
        childLabel: phraseChildLabel,
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
    if (isJunkPhrase(candidate.key) || isJunkPhrase(candidate.label)) continue;
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

function buildIngestHealthSnapshot(input: {
  fetchedAt: string;
  bucketTime: string;
  redditHttp: RedditHttpStats;
  redditPostsFetched: number;
  commentsFetched: number;
  commentsUsed: number;
  snippetsStored: number;
  commentSnippetFetchFailures: number;
  topicHitsSaved: number;
  savedPosts: number;
  dedupedByTitle: number;
  hnPostCountFetched: number;
  byPool: Record<
    RedditSourcePool,
    { bySubredditListing: Record<string, number>; uniquePosts: number }
  >;
  fetchAttemptsByPool: Record<RedditSourcePool, number>;
  redditListingRequestAttempts: number;
  redditMeta: {
    targetQpm: number;
    windowMinutes: number;
    selectedSubreddits: string[];
    skippedSubreddits: string[];
    backoffTriggered: boolean;
    rateLimitHeaders: Record<string, string>;
    oauthConfigured: boolean;
    oauthInUse: boolean;
    redditPublicFallbackUsed: boolean;
  };
  collector: RedditCollectorState | null;
  budgetChangeReason: string;
  commentHttpBudgetUsed: number;
  healthSnapshotReason?: "collector_reset" | "testing_full_wipe" | "budget_reset";
  redditPublicFallbackOnly?: boolean;
  skippedListingReason?: string | null;
  ingestRunDidNotPublishSnapshot?: boolean;
  ingestSkipPublishReason?: string | null;
}): IngestHealthSnapshot {
  const { redditHttp } = input;
  const fetchAttemptsByPool = input.fetchAttemptsByPool;
  const redditListingRequestAttempts = input.redditListingRequestAttempts;

  const redditUniquePostsByPool: Record<string, number> = {
    technology: input.byPool.technology.uniquePosts,
    economy: input.byPool.economy.uniquePosts,
    geopolitics: input.byPool.geopolitics.uniquePosts,
    general: input.byPool.general.uniquePosts,
  };

  const total = redditHttp.totalRedditRequests;
  const failed = redditHttp.failedRedditRequests;
  const failureRate = total > 0 ? failed / total : 0;
  const successRate = total > 0 ? redditHttp.successfulRedditRequests / total : 0;
  const c = input.collector;

  const publicFb = input.redditMeta.redditPublicFallbackUsed;
  const publicFallbackOnly = input.redditPublicFallbackOnly ?? false;
  const isManualBaseline =
    input.healthSnapshotReason === "collector_reset" ||
    input.healthSnapshotReason === "testing_full_wipe" ||
    input.healthSnapshotReason === "budget_reset";

  let lowDataWarning =
    input.topicHitsSaved < 8 ||
    input.redditPostsFetched < 25 ||
    (!input.redditMeta.oauthConfigured && !publicFb && !publicFallbackOnly);
  let redditOAuthWarning =
    !publicFallbackOnly && !input.redditMeta.oauthConfigured && !publicFb;
  /** Baseline rows after Reset/Clear are not a failed collection — suppress OAuth/low-data until a real ingest runs. */
  if (isManualBaseline) {
    lowDataWarning = false;
    redditOAuthWarning = false;
  }

  const highFailureRateWarning = total >= 8 && failureRate >= 0.25;
  const rateLimitWarning =
    (redditHttp.statusCounts["429"] ?? 0) > 0 || input.redditMeta.backoffTriggered;
  const authIssueWarning =
    (redditHttp.statusCounts["401"] ?? 0) > 0 ||
    (redditHttp.statusCounts["403"] ?? 0) > 0;

  const healthNeutralHint: IngestHealthSnapshot["healthNeutralHint"] = isManualBaseline
    ? input.healthSnapshotReason === "testing_full_wipe"
      ? "history_cleared"
      : input.healthSnapshotReason === "budget_reset"
        ? "budget_reset"
        : "cycle_reset"
    : undefined;

  return {
    lastIngestAt: input.fetchedAt,
    bucketTime: input.bucketTime,
    redditOnlyMode: true,
    candidateFilterMode: CANDIDATE_FILTER_MODE,
    canonicalMergeMode: CANONICAL_MERGE_MODE,
    totalRedditRequests: redditHttp.totalRedditRequests,
    successfulRedditRequests: redditHttp.successfulRedditRequests,
    failedRedditRequests: redditHttp.failedRedditRequests,
    emptyResponses: redditHttp.emptyResponses,
    statusCounts: { ...redditHttp.statusCounts },
    lowDataWarning,
    highFailureRateWarning,
    rateLimitWarning,
    authIssueWarning,
    redditPostsFetched: input.redditPostsFetched,
    commentsFetched: input.commentsFetched,
    commentsUsed: input.commentsUsed,
    snippetsStored: input.snippetsStored,
    commentSnippetFetchAttempts: input.commentsFetched,
    commentSnippetFetchFailures: input.commentSnippetFetchFailures,
    topicHitsSaved: input.topicHitsSaved,
    savedPosts: input.savedPosts,
    dedupedByTitle: input.dedupedByTitle,
    redditListingRequestAttempts,
    fetchAttemptsByPool: { ...fetchAttemptsByPool },
    redditUniquePostsByPool,
    hnPostCountFetched: input.hnPostCountFetched,
    redditTargetQpm: input.redditMeta.targetQpm,
    redditWindowMinutes: input.redditMeta.windowMinutes,
    redditActualRequestCount: redditHttp.totalRedditRequests,
    redditSelectedSubreddits: [...input.redditMeta.selectedSubreddits],
    redditSkippedSubreddits: [...input.redditMeta.skippedSubreddits],
    redditBackoffTriggered: input.redditMeta.backoffTriggered,
    rateLimitHeadersSeen:
      Object.keys(input.redditMeta.rateLimitHeaders).length > 0
        ? { ...input.redditMeta.rateLimitHeaders }
        : null,
    redditOAuthConfigured: input.redditMeta.oauthConfigured,
    redditOAuthInUse: input.redditMeta.oauthInUse,
    redditOAuthWarning,
    redditPublicFallbackUsed: publicFb,
    budgetMode: "adaptive",
    currentAdaptiveBudget: c?.currentRequestBudget,
    previousAdaptiveBudget: c?.previousRequestBudget,
    minRequestBudget: c?.minRequestBudget,
    maxRequestBudget: c?.maxRequestBudget,
    successRate,
    failureRate,
    http429Count: redditHttp.statusCounts["429"] ?? 0,
    authErrorCount: (redditHttp.statusCounts["401"] ?? 0) + (redditHttp.statusCounts["403"] ?? 0),
    emptyResponseCount: redditHttp.emptyResponses,
    budgetChangeReason: input.budgetChangeReason,
    globalBackoffActive: Boolean(
      c?.globalBackoffUntil && new Date(c.globalBackoffUntil) > new Date(input.fetchedAt),
    ),
    lanePenalty: c ? { ...c.lanePenalty } : undefined,
    pausedDueToBudget: c?.currentCycleStatus === "aborted_budget",
    pausedDueTo429: c?.currentCycleStatus === "aborted_429",
    currentCycleStatus: c?.currentCycleStatus,
    refreshedAt: c?.refreshedAt ?? null,
    lastPublishAt: c?.lastPublishAt ?? null,
    nextPublishEligibility:
      c?.currentCycleStatus === "complete"
        ? "cycle_complete"
        : c?.currentCycleStatus === "partial" || c?.currentCycleStatus === "aborted_429" || c?.currentCycleStatus === "aborted_budget"
          ? "partial_or_aborted"
          : "pending_or_idle",
    completedLanes: c ? [...c.completedLanes] : [],
    failedLanes: c ? [...c.failedLanes] : [],
    deferredLanes: c ? [...(c.deferredLanes ?? [])] : [],
    missingLanes: c ? LANE_ORDER.filter((lane) => !c.completedLanes.includes(lane)) : [],
    collectorCycleId: c?.currentCycleId,
    commentHttpBudgetUsed: input.commentHttpBudgetUsed,
    healthSnapshotReason: input.healthSnapshotReason,
    healthNeutralHint,
    redditPublicFallbackOnly: publicFallbackOnly || undefined,
    collectorModeLabel: publicFallbackOnly ? "public fallback only (temporary)" : null,
    listingSkippedReason: input.skippedListingReason ?? null,
    ingestRunDidNotPublishSnapshot: input.ingestRunDidNotPublishSnapshot,
    ingestSkipPublishReason: input.ingestSkipPublishReason ?? null,
  };
}

function emptyRedditHttpStats(): RedditHttpStats {
  return {
    totalRedditRequests: 0,
    successfulRedditRequests: 0,
    failedRedditRequests: 0,
    emptyResponses: 0,
    statusCounts: {},
  };
}

const EMPTY_BY_POOL: Record<
  RedditSourcePool,
  { bySubredditListing: Record<string, number>; uniquePosts: number }
> = {
  technology: { bySubredditListing: {}, uniquePosts: 0 },
  economy: { bySubredditListing: {}, uniquePosts: 0 },
  geopolitics: { bySubredditListing: {}, uniquePosts: 0 },
  general: { bySubredditListing: {}, uniquePosts: 0 },
};

const ZERO_FETCH_BY_POOL: Record<RedditSourcePool, number> = {
  technology: 0,
  economy: 0,
  geopolitics: 0,
  general: 0,
};

/**
 * Writes a health snapshot after collector-only changes (reset / testing wipe) so the UI updates
 * without running a full Reddit fetch. Not used by normal `runIngest` retention (bucket-scoped deletes).
 */
export async function recordHealthSnapshotAfterCollectorReset(
  fetchedAt: Date,
  reason: "collector_reset" | "testing_full_wipe" | "budget_reset",
): Promise<void> {
  let { state: collector } = await loadRedditCollectorState(fetchedAt);
  const bucketTime = getIngestBucketTime(fetchedAt);
  const redditEnv = loadRedditIngestEnv();
  const prevPublishAt = collector.lastPublishAt;
  try {
    collector.lastPublishAt = fetchedAt.toISOString();
    const health = buildIngestHealthSnapshot({
      fetchedAt: fetchedAt.toISOString(),
      bucketTime: bucketTime.toISOString(),
      redditHttp: emptyRedditHttpStats(),
      redditPostsFetched: 0,
      commentsFetched: 0,
      commentsUsed: 0,
      snippetsStored: 0,
      commentSnippetFetchFailures: 0,
      topicHitsSaved: 0,
      savedPosts: 0,
      dedupedByTitle: 0,
      hnPostCountFetched: 0,
      byPool: { ...EMPTY_BY_POOL },
      fetchAttemptsByPool: { ...ZERO_FETCH_BY_POOL },
      redditListingRequestAttempts: 0,
      redditMeta: {
        targetQpm: redditEnv.targetQpm,
        windowMinutes: redditEnv.windowMinutes,
        selectedSubreddits: [],
        skippedSubreddits: [],
        backoffTriggered: false,
        rateLimitHeaders: {},
        oauthConfigured: redditEnv.oauthComplete,
        oauthInUse: false,
        redditPublicFallbackUsed: false,
      },
      collector: { ...collector },
      budgetChangeReason: collector.budgetChangeReason,
      commentHttpBudgetUsed: 0,
      healthSnapshotReason: reason,
    });
    await db.ingestSnapshot.create({
      data: {
        bucketTime,
        healthJson: JSON.stringify(health),
      },
    });
    await saveRedditCollectorState(collector, JSON.stringify(collector.cursors));
  } catch {
    collector.lastPublishAt = prevPublishAt;
  }
}

/**
 * Destructive testing/admin wipe: removes all posts, topic hits, snapshots; resets collector + cursor state.
 * Does not change per-run `runIngest` behavior (bucket-scoped topic deletes, scoring, etc.).
 */
export async function wipeAllStoredIngestDataForTesting(): Promise<{
  deletedTopicHits: number;
  deletedPosts: number;
  deletedSnapshots: number;
}> {
  const [topicHits, posts, snapshots] = await db.$transaction([
    db.topicHit.deleteMany(),
    db.post.deleteMany(),
    db.ingestSnapshot.deleteMany(),
  ]);
  await resetRedditCollectorForFreshCycle(new Date());
  await recordHealthSnapshotAfterCollectorReset(new Date(), "testing_full_wipe");
  return {
    deletedTopicHits: topicHits.count,
    deletedPosts: posts.count,
    deletedSnapshots: snapshots.count,
  };
}

type FetchRedditPostsResult = {
  posts: SourcePost[];
  listingCounts: Record<string, number>;
  byPool: Record<
    RedditSourcePool,
    { bySubredditListing: Record<string, number>; uniquePosts: number }
  >;
  dedupedCount: number;
  redditHttp: RedditHttpStats;
  redditEnv: RedditIngestEnv;
  /** Null when listing phase returned early (e.g. next-eligible / backoff skip). Otherwise OAuth or public JSON client. */
  redditClient: RedditApiClient | null;
  clientExtras: RedditClientExtras;
  oauthConfigured: boolean;
  oauthInUse: boolean;
  redditPublicFallback: boolean;
  selectedSubreddits: string[];
  skippedSubreddits: string[];
  fetchAttemptsByPool: Record<RedditSourcePool, number>;
  listingHttpAttempts: number;
  commentBudgetGate: RedditHttpBudgetGate | null;
  /** Listing-phase metrics for adaptive budget (interim collector). */
  listingMetrics: import("@/src/lib/reddit/redditListingFetch").ListingFetchResult["metrics"];
  configSummary: {
    listings: string[];
    limitsByListing: Record<RedditListing, number>;
    subredditsByPool: Record<RedditSourcePool, number>;
    fetchAttempts: number;
  };
};

function worstLaneFrom429(m: Record<RedditSourcePool, number>): RedditSourcePool | null {
  let best: RedditSourcePool | null = null;
  let n = 0;
  for (const p of LANE_ORDER) {
    if (m[p] > n) {
      n = m[p];
      best = p;
    }
  }
  return n > 0 ? best : null;
}

async function fetchRedditCommentSnippets(
  postId: string,
  client: RedditApiClient,
  redditHttp: RedditHttpStats,
): Promise<{ bodies: string[]; ok: boolean }> {
  const res = await client.fetchJson(
    `/comments/${postId}.json?limit=${REDDIT_COMMENT_FETCH_LIMIT}`,
  );
  let data: unknown;
  try {
    data = res.ok ? await res.json() : null;
  } catch {
    data = null;
  }

  const out: string[] = [];
  if (res.ok && Array.isArray(data) && data.length >= 2) {
    const listing = data[1] as { data?: { children?: unknown[] } };
    const children = listing?.data?.children ?? [];
    for (const item of children) {
      const node = item as { kind?: string; data?: Record<string, unknown> };
      if (node.kind === "more") continue;
      if (node.kind !== "t1" || !node.data) continue;
      const d = node.data;
      const body = d.body != null ? String(d.body) : "";
      if (body === "[deleted]" || body === "[removed]") continue;
      const parentId = d.parent_id != null ? String(d.parent_id) : "";
      const topLevel =
        parentId.startsWith("t3_") ||
        (typeof d.depth === "number" && d.depth === 0);
      if (!topLevel) continue;
      let text = sanitizeCommentBody(body);
      if (!text) continue;
      if (text.length > REDDIT_COMMENT_MAX_CHARS) {
        text = `${text.slice(0, REDDIT_COMMENT_MAX_CHARS)}…`;
      }
      out.push(text);
      if (out.length >= REDDIT_COMMENT_STORE_MAX) break;
    }
  }

  recordRedditHttpAttempt(redditHttp, res, res.ok && out.length === 0);
  if (!res.ok) return { bodies: [], ok: false };
  return { bodies: out, ok: true };
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

class SkipSnapshotPublishError extends Error {
  constructor(public readonly skipReason: string) {
    super(skipReason);
    this.name = "SkipSnapshotPublishError";
  }
}

/** A run must do something visible (Reddit HTTP, subs, posts, or topic hits) to replace the latest snapshot. */
function isPublishableIngestOutcome(o: {
  totalRedditRequests: number;
  redditSelectedSubredditCount: number;
  redditPostsFetched: number;
  topicHitsSaved: number;
  savedPosts: number;
}): boolean {
  return (
    o.totalRedditRequests > 0 ||
    o.redditSelectedSubredditCount > 0 ||
    o.redditPostsFetched > 0 ||
    o.topicHitsSaved > 0 ||
    o.savedPosts > 0
  );
}

function countLanesWithUniquePosts(
  byPool: Record<RedditSourcePool, { uniquePosts: number }>,
): number {
  return LANE_ORDER.filter((l) => (byPool[l]?.uniquePosts ?? 0) > 0).length;
}

function countLanesWithUniquePostsFromHealth(h: IngestHealthSnapshot): number {
  const m = h.redditUniquePostsByPool ?? {};
  return LANE_ORDER.filter((l) => (m[l] ?? 0) > 0).length;
}

/**
 * Avoid replacing the latest visible ingest snapshot with a weaker partial run (narrower lanes or fewer hits).
 * Full cycles always publish; first snapshot or near-empty previous always allows.
 */
function qualityAllowsReplacingLatestSnapshot(args: {
  prev: IngestHealthSnapshot | null;
  newCycleStatus: RedditCollectorState["currentCycleStatus"];
  newCompletedLanes: readonly string[];
  newByPool: Record<RedditSourcePool, { uniquePosts: number }>;
  newTopicHits: number;
  newRedditPosts: number;
}): { allow: boolean; reason: string } {
  const { prev, newCycleStatus, newCompletedLanes, newByPool, newTopicHits, newRedditPosts } =
    args;
  if (!prev) return { allow: true, reason: "first_snapshot" };

  const prevNearEmpty =
    (prev.topicHitsSaved ?? 0) === 0 && (prev.redditPostsFetched ?? 0) < 5;
  if (prevNearEmpty) return { allow: true, reason: "previous_near_empty" };

  if (newCycleStatus === "complete") return { allow: true, reason: "cycle_complete" };

  const prevCov = countLanesWithUniquePostsFromHealth(prev);
  const newCov = countLanesWithUniquePosts(newByPool);
  const prevHits = prev.topicHitsSaved ?? 0;
  const prevPosts = prev.redditPostsFetched ?? 0;
  const prevCompleted = (prev.completedLanes ?? []).length;
  const newCompleted = newCompletedLanes.length;

  if (newCov > prevCov) return { allow: true, reason: "better_lane_coverage" };

  if (newCov === prevCov && newCompleted > prevCompleted) {
    return { allow: true, reason: "more_lanes_completed_same_post_coverage" };
  }

  if (newCov < prevCov) {
    return { allow: false, reason: "snapshot_quality_below_previous_narrower_lanes" };
  }

  const hitsOk = newTopicHits >= prevHits - 1;
  const postsOk = newRedditPosts >= prevPosts - 2;
  if (hitsOk && postsOk) {
    return { allow: true, reason: "equal_coverage_not_weaker_volume" };
  }

  if (newTopicHits < prevHits - 2 && newRedditPosts < prevPosts - 4) {
    return { allow: false, reason: "snapshot_quality_below_previous_weaker_volume" };
  }

  if (newTopicHits < prevHits - 2) {
    return { allow: false, reason: "snapshot_quality_below_previous_fewer_topic_hits" };
  }

  return { allow: true, reason: "equal_coverage_marginal" };
}

/**
 * Full ingest: loads persisted `RedditCollectorState` (cursors, budgets) and runs listing fetch.
 * If the previous run stopped with `aborted_budget` / partial lanes, the next call continues from
 * saved cursors — nothing auto-invokes this except cron, `POST /api/ingest`, or the dev UI auto-collect.
 */
export async function runIngest() {
  const fetchedAt = new Date();
  const bucketTime = getIngestBucketTime(fetchedAt);
  const bucketTimeIso = bucketTime.toISOString();

  const previousSnapshotRow = await getLatestIngestSnapshot();

  let { state: collector } = await loadRedditCollectorState(fetchedAt);

  const [listingPhase, hnResult] = await Promise.all([
    runRedditListingFetchPhase({
      fetchedAt,
      bucketTimeIso,
      collector,
      poolsConfig: {
        pools: SOURCE_CONFIG.reddit.pools,
        limitsByListing: SOURCE_CONFIG.reddit.limitsByListing,
      },
    }),
    fetchHnPosts(),
  ]);

  collector = listingPhase.collector;

  if (listingPhase.redditHttp.totalRedditRequests === 0) {
    neutralizeStaleLaneStateIfNoHttp(collector);
  }

  const skippedListingReason = listingPhase.metrics.skippedReason;

  const redditResult: FetchRedditPostsResult = {
    posts: listingPhase.posts,
    listingCounts: listingPhase.listingCounts,
    byPool: listingPhase.byPool,
    dedupedCount: listingPhase.dedupedCount,
    redditHttp: listingPhase.redditHttp,
    redditEnv: listingPhase.redditEnv,
    redditClient: listingPhase.redditClient,
    clientExtras: listingPhase.clientExtras,
    oauthConfigured: listingPhase.oauthConfigured,
    oauthInUse: listingPhase.oauthInUse,
    redditPublicFallback: listingPhase.redditPublicFallback,
    selectedSubreddits: listingPhase.selectedSubreddits,
    skippedSubreddits: listingPhase.skippedSubreddits,
    fetchAttemptsByPool: listingPhase.fetchAttemptsByPool,
    listingHttpAttempts: listingPhase.listingHttpAttempts,
    commentBudgetGate: listingPhase.commentBudgetGate,
    listingMetrics: listingPhase.metrics,
    configSummary: listingPhase.configSummary,
  };

  const redditPosts = redditResult.posts;
  /** Comment enrichment only when listing finished a full cycle — keeps HTTP and focus on lane fairness. */
  const allowCommentEnrichment =
    listingPhase.collector.currentCycleStatus === "complete" &&
    !listingPhase.metrics.abortedEarly;
  let commentsFetched = 0;
  let commentsUsed = 0;
  let commentSnippetFetchFailures = 0;
  let commentHttpBudgetUsed = 0;
  const hnPosts = hnResult.posts;
  /** Reddit-only topic pipeline (HN still fetched, not merged into extraction for now). */
  const allPosts = [...redditPosts];

  const uniqueTitleFingerprint = new Set<string>();
  const prepared: Array<{ post: SourcePost; postId: number; candidates: PhraseCandidate[] }> = [];
  const candidateFrequency = new Map<string, number>();
  const candidateLabels = new Map<string, string[]>();
  const candidateSourceSpread = new Map<string, Set<SourcePost["source"]>>();

  let savedPosts = 0;
  let dedupedByTitle = 0;
  let topicHitsSaved = 0;
  let snapshotPublished = false;
  let skipPublishReason: string | null = null;

  type IngestTx = Parameters<Parameters<typeof db.$transaction>[0]>[0];

  const runPostsAndTopics = async (tx: IngestTx) => {
    await tx.topicHit.deleteMany({ where: { bucketTime } });

    for (const post of allPosts) {
      const fingerprint = normalizeTitleFingerprint(post.title);
      if (uniqueTitleFingerprint.has(fingerprint)) {
        dedupedByTitle += 1;
        continue;
      }
      uniqueTitleFingerprint.add(fingerprint);

      let postForDb: SourcePost = post;
      if (
        post.source === "reddit" &&
        post.reddit &&
        redditResult.redditClient &&
        allowCommentEnrichment &&
        shouldFetchCommentSnippets(
          post.reddit.pool,
          post.reddit.score,
          post.reddit.numComments,
          redditResult.redditEnv,
        )
      ) {
        if (!redditResult.commentBudgetGate?.tryConsumeComment()) {
          /* comment sub-budget exhausted — keep listing enrichment only */
        } else {
          commentsFetched += 1;
          commentHttpBudgetUsed += 1;
          const { bodies, ok } = await fetchRedditCommentSnippets(
            post.externalId,
            redditResult.redditClient,
            redditResult.redditHttp,
          );
          if (!ok) commentSnippetFetchFailures += 1;
          commentsUsed += bodies.length;
          if (bodies.length > 0) {
            postForDb = {
              ...post,
              redditComments: bodies.map((body) => ({ body })),
            };
          }
        }
      }

      const postData = prismaPostData(postForDb, fetchedAt);
      const savedPostRow = await tx.post.upsert({
        where: {
          source_externalId: {
            source: post.source,
            externalId: post.externalId,
          },
        },
        update: postData,
        create: {
          source: post.source,
          externalId: post.externalId,
          ...postData,
        },
      });
      savedPosts += 1;

      const candidates = extractCandidatesFromText(discussionTextForExtraction(post));
      prepared.push({ post, postId: savedPostRow.id, candidates });

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

    topicHitsSaved = 0;
    for (const item of prepared) {
      const assigned = pickParentForPost(
        item.candidates,
        discussionTextForExtraction(item.post),
        candidateFrequency,
        candidateSourceSpread,
        candidateLabels,
        item.post,
      );
      if (!assigned) continue;

      await tx.topicHit.create({
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

    const quality = qualityAllowsReplacingLatestSnapshot({
      prev: previousSnapshotRow?.health ?? null,
      newCycleStatus: listingPhase.collector.currentCycleStatus,
      newCompletedLanes: listingPhase.collector.completedLanes,
      newByPool: redditResult.byPool,
      newTopicHits: topicHitsSaved,
      newRedditPosts: redditResult.dedupedCount,
    });
    if (!quality.allow) {
      throw new SkipSnapshotPublishError(`snapshot_quality_below_previous:${quality.reason}`);
    }

    if (
      !isPublishableIngestOutcome({
        totalRedditRequests: redditResult.redditHttp.totalRedditRequests,
        redditSelectedSubredditCount: redditResult.selectedSubreddits.length,
        redditPostsFetched: redditResult.dedupedCount,
        topicHitsSaved,
        savedPosts,
      })
    ) {
      throw new SkipSnapshotPublishError("no_meaningful_reddit_work");
    }
  };

  try {
    if (allPosts.length === 0) {
      throw new SkipSnapshotPublishError(
        skippedListingReason ? `skipped_listing_${skippedListingReason}` : "no_posts_to_process",
      );
    }
    await db.$transaction(async (tx) => {
      await runPostsAndTopics(tx);
    });
    snapshotPublished = true;
    collector.lastSkippedPublishAt = null;
    collector.lastSkippedPublishReason = null;
  } catch (e) {
    if (e instanceof SkipSnapshotPublishError) {
      skipPublishReason = e.skipReason;
      snapshotPublished = false;
      collector.lastSkippedPublishAt = fetchedAt.toISOString();
      collector.lastSkippedPublishReason = e.skipReason;
      topicHitsSaved = 0;
      savedPosts = 0;
      dedupedByTitle = 0;
    } else {
      throw e;
    }
  }

  const prevBudget = collector.currentRequestBudget;
  const worst = worstLaneFrom429(listingPhase.metrics.lane429);
  const sig = buildSignalsFromStats(redditResult.redditHttp, {
    listingHttp: redditResult.listingHttpAttempts,
    commentHttp: commentHttpBudgetUsed,
    abortedEarly: listingPhase.metrics.abortedEarly,
    listingAbortReason: listingPhase.metrics.abortReason,
    worstLane: worst,
  });
  const adaptiveOut = computeNextAdaptiveBudget(collector, sig);
  collector.previousRequestBudget = prevBudget;
  collector.currentRequestBudget = adaptiveOut.next;
  collector.budgetChangeReason = adaptiveOut.reason;
  if (adaptiveOut.globalBackoffUntil) {
    collector.globalBackoffUntil = adaptiveOut.globalBackoffUntil;
  }
  for (const [k, d] of Object.entries(adaptiveOut.lanePenaltyDelta)) {
    const pool = k as RedditSourcePool;
    collector.lanePenalty[pool] = Math.min(0.5, (collector.lanePenalty[pool] ?? 0) + d);
  }
  if (redditResult.posts.length > 0) {
    collector.lastSuccessfulCollectAt = fetchedAt.toISOString();
  }
  await saveRedditCollectorState(collector, JSON.stringify(collector.cursors));

  const snippetsStored = commentsUsed;

  const makeHealth = (c: RedditCollectorState) =>
    buildIngestHealthSnapshot({
      fetchedAt: fetchedAt.toISOString(),
      bucketTime: bucketTime.toISOString(),
      redditHttp: redditResult.redditHttp,
      redditPostsFetched: redditResult.dedupedCount,
      commentsFetched,
      commentsUsed,
      snippetsStored,
      commentSnippetFetchFailures,
      topicHitsSaved,
      savedPosts,
      dedupedByTitle,
      hnPostCountFetched: hnPosts.length,
      byPool: redditResult.byPool,
      fetchAttemptsByPool: redditResult.fetchAttemptsByPool,
      redditListingRequestAttempts: redditResult.listingHttpAttempts,
      redditMeta: {
        targetQpm: redditResult.redditEnv.targetQpm,
        windowMinutes: redditResult.redditEnv.windowMinutes,
        selectedSubreddits: redditResult.selectedSubreddits,
        skippedSubreddits: redditResult.skippedSubreddits,
        backoffTriggered: redditResult.clientExtras.backoffTriggered,
        rateLimitHeaders: redditResult.clientExtras.rateLimitHeadersLast,
        oauthConfigured: redditResult.oauthConfigured,
        oauthInUse: redditResult.oauthInUse,
        redditPublicFallbackUsed: redditResult.redditPublicFallback,
      },
      collector: { ...c },
      budgetChangeReason: adaptiveOut.reason,
      commentHttpBudgetUsed,
      redditPublicFallbackOnly: redditResult.redditEnv.redditPublicFallbackOnly,
      skippedListingReason,
      ingestRunDidNotPublishSnapshot: !snapshotPublished,
      ingestSkipPublishReason: skipPublishReason,
    });

  let health: IngestHealthSnapshot;

  if (snapshotPublished) {
    const prevPublishAt = collector.lastPublishAt;
    try {
      collector.lastPublishAt = fetchedAt.toISOString();
      health = makeHealth(collector);
      await db.ingestSnapshot.create({
        data: {
          bucketTime,
          healthJson: JSON.stringify(health),
        },
      });
      await saveRedditCollectorState(collector, JSON.stringify(collector.cursors));
    } catch {
      /* DB may be behind schema until `prisma db push` */
      collector.lastPublishAt = prevPublishAt;
      health = makeHealth(collector);
    }
  } else {
    health = makeHealth(collector);
  }

  return {
    fetchedAt: fetchedAt.toISOString(),
    bucketTime: bucketTime.toISOString(),
    health,
    snapshotPublished,
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
    redditOnlyMode: true,
    redditPostCountUsed: redditPosts.length,
    hnPostCountFetched: hnPosts.length,
    candidateFilterMode: CANDIDATE_FILTER_MODE,
    commentsFetched,
    commentsUsed,
    snippetsStored,
    commentSnippetFetchFailures,
    commentSnippetFetchAttempts: commentsFetched,
    canonicalMergeMode: CANONICAL_MERGE_MODE,
  };
}

type TopicHitWithPost = Awaited<ReturnType<typeof db.topicHit.findMany>>[number] & {
  post: {
    source: string;
    title: string;
    url: string | null;
    selftext: string | null;
    externalUrl: string | null;
    createdAt: Date | null;
    fetchedAt: Date;
    numComments: number | null;
    redditScore?: number | null;
    /** Present after `prisma generate` once `Post.commentsJson` exists in the client. */
    commentsJson?: string | null;
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

const SAMPLE_COMMENT_UI_MAX = 220;

/**
 * Parse `Post.commentsJson` into comment bodies. Tolerates legacy `string[]`,
 * `{ body: string }[]`, null, and malformed JSON; always returns an array.
 */
export function parseCommentBodiesFromPostJson(raw: string | null | undefined): string[] {
  if (raw == null || raw === "") return [];
  try {
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return [];
    const out: string[] = [];
    for (const item of v) {
      if (typeof item === "string") {
        const b = sanitizeCommentBody(item);
        if (b) out.push(b);
        continue;
      }
      if (item && typeof item === "object" && "body" in item) {
        const body = (item as { body?: unknown }).body;
        if (typeof body === "string") {
          const b = sanitizeCommentBody(body);
          if (b) out.push(b);
        }
      }
    }
    return out;
  } catch {
    return [];
  }
}

/** Top tokens from comment bodies only (same tokenization/stopword rules as titles). */
function aggregateDiscussionKeywordsFromComments(
  commentLines: string[],
  maxKeywords: number,
): string[] {
  const freq = new Map<string, number>();
  for (const line of commentLines) {
    for (const token of tokenizeTitle(line)) {
      const k = normalizeToken(token);
      if (!k || k.length < 3) continue;
      freq.set(k, (freq.get(k) ?? 0) + 1);
    }
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, maxKeywords)
    .map(([w]) => w);
}

function toEvidence(rows: TopicHitWithPost[]) {
  const redditRows = rows.filter((r) => r.post.source === "reddit");
  const useRows = redditRows.length > 0 ? redditRows : rows;
  return useRows
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
  /** Full `post` include avoids PrismaClientValidationError when the generated client is stale
   * (e.g. `commentsJson` added to schema but `prisma generate` not run or dev server not restarted).
   */
  return db.topicHit.findMany({
    where: { bucketTime },
    include: { post: true },
  });
}

/** Live DB collector row for health API — distinct from last published snapshot JSON. */
export type LiveCollectorApiPayload = {
  refreshedAt: string | null;
  lastAttemptAt: string | null;
  lastSuccessfulCollectAt: string | null;
  lastPublishAt: string | null;
  lastSkippedPublishAt: string | null;
  lastSkippedPublishReason: string | null;
  /** From env at request time — interim public-only mode. */
  redditPublicFallbackOnly: boolean;
  currentCycleId: string;
  currentCycleStartedAt: string;
  currentCycleStatus: string;
  currentLane: string | null;
  completedLanes: string[];
  failedLanes: string[];
  deferredLanes: string[];
  missingLanes: string[];
  currentRequestBudget: number;
  previousRequestBudget: number;
  minRequestBudget: number;
  maxRequestBudget: number;
  budgetChangeReason: string;
  globalBackoffUntil: string | null;
  nextEligibleCollectAt: string | null;
  lastCycleSequence: number;
};

export function liveCollectorStateToApiPayload(state: RedditCollectorState): LiveCollectorApiPayload {
  const env = loadRedditIngestEnv();
  return {
    refreshedAt: state.refreshedAt,
    lastAttemptAt: state.lastAttemptAt,
    lastSuccessfulCollectAt: state.lastSuccessfulCollectAt,
    lastPublishAt: state.lastPublishAt,
    lastSkippedPublishAt: state.lastSkippedPublishAt ?? null,
    lastSkippedPublishReason: state.lastSkippedPublishReason ?? null,
    redditPublicFallbackOnly: env.redditPublicFallbackOnly,
    currentCycleId: state.currentCycleId,
    currentCycleStartedAt: state.currentCycleStartedAt,
    currentCycleStatus: state.currentCycleStatus,
    currentLane: state.currentLane,
    completedLanes: [...state.completedLanes],
    failedLanes: [...state.failedLanes],
    deferredLanes: [...(state.deferredLanes ?? [])],
    missingLanes: LANE_ORDER.filter((l) => !state.completedLanes.includes(l)),
    currentRequestBudget: state.currentRequestBudget,
    previousRequestBudget: state.previousRequestBudget,
    minRequestBudget: state.minRequestBudget,
    maxRequestBudget: state.maxRequestBudget,
    budgetChangeReason: state.budgetChangeReason,
    globalBackoffUntil: state.globalBackoffUntil,
    nextEligibleCollectAt: state.nextEligibleCollectAt,
    lastCycleSequence: state.lastCycleSequence,
  };
}

/** Latest persisted ingest snapshot (for API routes / scripts). */
export async function getLatestIngestSnapshot(): Promise<{
  id: number;
  createdAt: Date;
  bucketTime: Date;
  health: IngestHealthSnapshot;
} | null> {
  try {
    const row = await db.ingestSnapshot.findFirst({
      orderBy: { createdAt: "desc" },
    });
    if (!row?.healthJson) return null;
    return {
      id: row.id,
      createdAt: row.createdAt,
      bucketTime: row.bucketTime,
      health: JSON.parse(row.healthJson) as IngestHealthSnapshot,
    };
  } catch {
    return null;
  }
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

  const redditCurrentRows = (currentRows as TopicHitWithPost[]).filter(
    (r) => r.post.source === "reddit",
  );
  const redditPreviousRows = (previousRows as TopicHitWithPost[]).filter(
    (r) => r.post.source === "reddit",
  );
  const currentByDisplay = groupRowsByMergedDisplayParent(redditCurrentRows);
  const previousByDisplay = groupRowsByMergedDisplayParent(redditPreviousRows);

  const allTopics = [...currentByDisplay.entries()]
    .map(([parentKey, rows]) => {
      const current = rows.length;
      const previous = previousByDisplay.get(parentKey)?.length ?? 0;
      const repRow =
        rows.find((r) => displayParentForRow(r).key === parentKey) ?? rows[0]!;
      const { label: parentLabel } = displayParentForRow(repRow);
      const textBlobs = rows.map((r) => {
        const st = r.post.selftext?.trim();
        return st ? `${r.post.title}\n${st}` : r.post.title;
      });
      const category = inferTopicCategory(parentKey, textBlobs);
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

      let discussionScore = 0;
      const commentSnippets: string[] = [];
      let totalRedditScore = 0;
      let totalNumComments = 0;
      for (const row of rows) {
        const apiCount = row.post.numComments ?? 0;
        const stored = parseCommentBodiesFromPostJson(row.post.commentsJson);
        discussionScore += apiCount + stored.length;
        commentSnippets.push(...stored);
        totalRedditScore += row.post.redditScore ?? 0;
        totalNumComments += apiCount;
      }
      const sampledCommentCount = commentSnippets.length;
      const rowsByRecency = [...rows].sort((a, b) => {
        const at = (a.post.createdAt ?? a.post.fetchedAt).getTime();
        const bt = (b.post.createdAt ?? b.post.fetchedAt).getTime();
        return bt - at;
      });
      const sampleComments: string[] = [];
      outer: for (const row of rowsByRecency) {
        const bodies = parseCommentBodiesFromPostJson(row.post.commentsJson);
        for (const b of bodies) {
          if (sampleComments.length >= 2) break outer;
          sampleComments.push(
            b.length > SAMPLE_COMMENT_UI_MAX
              ? `${b.slice(0, SAMPLE_COMMENT_UI_MAX)}…`
              : b,
          );
        }
      }
      const discussionKeywords = aggregateDiscussionKeywordsFromComments(commentSnippets, 5);

      const scoreComponents = computeParentTopicScoreComponents(current, previous, sourceBreakdown);
      const metrics = computeParentTopicMetrics(current, previous, sourceBreakdown);
      const discussionCtx = { current: metrics.current, delta: metrics.delta };
      const discussionContrib = discussionScoreContribution(discussionScore, discussionCtx);
      const score = scoreWithDiscussionBonus(scoreComponents.baseScore, discussionScore, discussionCtx);

      const children = combineChildrenForParent(rows, parentKey);
      const mergedParentFragments = mergeFragmentChildren(rows, parentKey).map((c) => ({
        key: c.childKey,
        label: c.childLabel,
        count: c.count,
      }));
      const evidenceCount = children.reduce((acc, c) => acc + c.evidence.length, 0);

      const scoreBreakdown: TopicScoreBreakdown = {
        deltaContribution: scoreComponents.delta,
        growthContribution: scoreComponents.growthBonus,
        sourceSpreadContribution: scoreComponents.spreadBonus,
        discussionContribution: discussionContrib,
        totalScore: score,
      };

      const analytics: TopicAnalytics = {
        current: metrics.current,
        previous: metrics.previous,
        delta: metrics.delta,
        growthRatio: metrics.growthRatio,
        sourceCount: metrics.sourceCount,
        sourceBreakdown: { ...sourceBreakdown },
        confidence: metrics.confidence,
        score,
        discussionScore,
        totalRedditScore,
        totalNumComments,
        sampledCommentCount,
        discussionKeywords: [...discussionKeywords],
        canonicalParentKey: repRow.canonicalParentKey ?? null,
        canonicalParentLabel: repRow.canonicalParentLabel ?? null,
        displayParentKey: parentKey,
        displayParentLabel: parentLabel,
        mergedParentFragments,
        childCount: children.length,
        evidenceCount,
        lastSeenAt: lastSeenAt ?? null,
        scoreBreakdown,
        discussionScoringNote: DISCUSSION_SCORING_NOTE,
        sampleComments: [...sampleComments],
      };

      return {
        parentKey,
        parentLabel,
        category,
        current: metrics.current,
        previous: metrics.previous,
        delta: metrics.delta,
        growthRatio: metrics.growthRatio,
        sourceCount: metrics.sourceCount,
        score,
        confidence: metrics.confidence,
        discussionScore,
        sampleComments,
        discussionKeywords,
        sourceBreakdown,
        lastSeenAt: lastSeenAt ?? null,
        children,
        analytics,
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
