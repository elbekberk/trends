import { db } from "@/src/lib/db";

type SourcePost = {
  source: "reddit" | "hn";
  externalId: string;
  title: string;
  createdAt: Date | null;
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

async function fetchRedditPosts(): Promise<SourcePost[]> {
  const subreddits = ["technology", "programming", "entrepreneur"];
  const results: SourcePost[] = [];

  for (const subreddit of subreddits) {
    const res = await fetch(
      `https://www.reddit.com/r/${subreddit}/hot.json?limit=30`,
      {
        headers: { "User-Agent": "trend-mvp/0.1" },
        cache: "no-store",
      },
    );

    if (!res.ok) continue;
    const data = await res.json();
    const posts = data?.data?.children ?? [];

    for (const item of posts) {
      const p = item?.data;
      if (!p?.id || !p?.title) continue;
      results.push({
        source: "reddit",
        externalId: p.id,
        title: String(p.title),
        createdAt: p.created_utc ? new Date(p.created_utc * 1000) : null,
      });
    }
  }

  return results;
}

async function fetchHnPosts(): Promise<SourcePost[]> {
  const idsRes = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json",
    { cache: "no-store" },
  );
  if (!idsRes.ok) return [];

  const ids: number[] = (await idsRes.json()).slice(0, 60);
  const results: SourcePost[] = [];

  for (const id of ids) {
    const itemRes = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
      { cache: "no-store" },
    );
    if (!itemRes.ok) continue;
    const item = await itemRes.json();
    if (!item?.id || !item?.title || item?.type !== "story") continue;
    results.push({
      source: "hn",
      externalId: String(item.id),
      title: String(item.title),
      createdAt: item.time ? new Date(item.time * 1000) : null,
    });
  }

  return results;
}

export async function runIngest() {
  const fetchedAt = new Date();
  const bucketTime = getBucketTime(fetchedAt);

  const [redditPosts, hnPosts] = await Promise.all([
    fetchRedditPosts(),
    fetchHnPosts(),
  ]);
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
    redditPosts: redditPosts.length,
    hnPosts: hnPosts.length,
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
