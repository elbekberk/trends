import type { RedditDiscussionFields, RedditListing, RedditSourcePool } from "@/src/lib/reddit/types";

const MAX_SELFTEXT_LEN = 12_000;

export function redditThreadUrl(permalink: string): string {
  const p = String(permalink);
  if (p.startsWith("http://") || p.startsWith("https://")) return p;
  return `https://www.reddit.com${p.startsWith("/") ? p : `/${p}`}`;
}

export function parseRedditListing(
  p: Record<string, unknown>,
  pool: RedditSourcePool,
  subredditFromRoute: string,
  listing: RedditListing,
): RedditDiscussionFields {
  const selftextRaw = p.selftext != null ? String(p.selftext) : "";
  const selftext =
    selftextRaw.length > MAX_SELFTEXT_LEN
      ? `${selftextRaw.slice(0, MAX_SELFTEXT_LEN)}…`
      : selftextRaw;

  const permalink = p.permalink != null ? String(p.permalink) : "";
  const threadUrl = permalink ? redditThreadUrl(permalink) : "";
  const rawUrl = p.url != null ? String(p.url) : "";
  const isSelf = typeof p.is_self === "boolean" ? p.is_self : null;

  let externalUrl: string | null = null;
  if (isSelf === true) {
    externalUrl = null;
  } else if (rawUrl && threadUrl && rawUrl !== threadUrl) {
    externalUrl = rawUrl;
  }

  const subreddit =
    (p.subreddit != null ? String(p.subreddit) : null) ?? subredditFromRoute;

  return {
    pool,
    subreddit,
    listing,
    externalUrl,
    selftext,
    score: typeof p.score === "number" ? p.score : null,
    numComments: typeof p.num_comments === "number" ? p.num_comments : null,
    domain: p.domain != null ? String(p.domain) : null,
    isSelf,
  };
}
