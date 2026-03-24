import { db } from "@/src/lib/db";

type SourcePost = {
  source: "reddit" | "hn";
  externalId: string;
  title: string;
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
]);

function getBucketTime(input = new Date()): Date {
  const d = new Date(input);
  d.setUTCMinutes(0, 0, 0);
  const hour = d.getUTCHours();
  d.setUTCHours(hour - (hour % 2));
  return d;
}

function extractTopics(title: string): string[] {
  const cleaned = title.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
  const tokens = cleaned.split(/\s+/).filter(Boolean);

  return tokens.filter(
    (token) =>
      token.length >= 3 &&
      token.length <= 24 &&
      !STOPWORDS.has(token) &&
      !/^\d+$/.test(token),
  );
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

  let savedPosts = 0;
  const topicMap = new Map<string, number>();

  for (const post of allPosts) {
    await db.post.upsert({
      where: {
        source_externalId: {
          source: post.source,
          externalId: post.externalId,
        },
      },
      update: {
        title: post.title,
        createdAt: post.createdAt,
        fetchedAt,
      },
      create: {
        source: post.source,
        externalId: post.externalId,
        title: post.title,
        createdAt: post.createdAt,
        fetchedAt,
      },
    });
    savedPosts += 1;

    const uniqueTopicsInTitle = new Set(extractTopics(post.title));
    for (const topic of uniqueTopicsInTitle) {
      topicMap.set(topic, (topicMap.get(topic) ?? 0) + 1);
    }
  }

  let updatedTopics = 0;
  for (const [topic, count] of topicMap.entries()) {
    await db.topicCount.upsert({
      where: {
        topic_bucketTime: {
          topic,
          bucketTime,
        },
      },
      update: { count },
      create: {
        topic,
        bucketTime,
        count,
      },
    });
    updatedTopics += 1;
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
    },
    totalUniquePosts: allPosts.length,
    savedPosts,
    topicsUpdated: updatedTopics,
  };
}

export async function getRisingTopics(limit = 30) {
  const latest = await db.topicCount.findFirst({
    orderBy: { bucketTime: "desc" },
  });
  if (!latest) return [];

  const currentBucket = latest.bucketTime;
  const previousBucket = new Date(currentBucket.getTime() - 2 * 60 * 60 * 1000);

  const [currentRows, previousRows] = await Promise.all([
    db.topicCount.findMany({ where: { bucketTime: currentBucket } }),
    db.topicCount.findMany({ where: { bucketTime: previousBucket } }),
  ]);

  const previousMap = new Map(previousRows.map((r) => [r.topic, r.count]));

  return currentRows
    .map((row) => {
      const previous = previousMap.get(row.topic) ?? 0;
      const current = row.count;
      return {
        topic: row.topic,
        current,
        previous,
        score: current - previous,
      };
    })
    .sort((a, b) => b.score - a.score || b.current - a.current)
    .slice(0, limit);
}
