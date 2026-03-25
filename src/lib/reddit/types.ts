export type RedditSourcePool = "technology" | "economy" | "geopolitics" | "general";

export type RedditListing = "hot" | "new" | "rising";

/** Reddit-only fields captured at ingest (discussion-first; outbound link is secondary). */
export type RedditDiscussionFields = {
  pool: RedditSourcePool;
  subreddit: string;
  listing: RedditListing;
  externalUrl: string | null;
  selftext: string;
  score: number | null;
  numComments: number | null;
  domain: string | null;
  isSelf: boolean | null;
};

export type SourcePost = {
  source: "reddit" | "hn";
  externalId: string;
  title: string;
  /** Primary URL: Reddit thread for reddit; HN story or item page for hn. */
  url: string | null;
  createdAt: Date | null;
  reddit?: RedditDiscussionFields;
  /** Top-level comment snippets; never passed to `extractCandidatesFromText`. */
  redditComments?: Array<{ body: string }>;
};
