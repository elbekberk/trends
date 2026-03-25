import { clearRedditTokenCache, getRedditAccessToken } from "@/src/lib/reddit/redditAuth";
import type { RedditIngestEnv, RedditOAuthEnv } from "@/src/lib/reddit/redditEnv";
import { RedditRequestScheduler } from "@/src/lib/reddit/redditScheduler";

export type RedditHttpStats = {
  totalRedditRequests: number;
  successfulRedditRequests: number;
  failedRedditRequests: number;
  emptyResponses: number;
  statusCounts: Record<string, number>;
};

export type RedditClientExtras = {
  rateLimitHeadersLast: Record<string, string>;
  backoffTriggered: boolean;
};

const RATE_KEYS = [
  "x-ratelimit-remaining",
  "x-ratelimit-reset",
  "x-ratelimit-used",
  "retry-after",
] as const;

function captureRateHeaders(h: Headers, target: Record<string, string>): void {
  for (const key of RATE_KEYS) {
    const v = h.get(key);
    if (v != null && v !== "") target[key] = v;
  }
}

function recordAttempt(
  stats: RedditHttpStats,
  res: Response,
  emptyPayload: boolean,
): void {
  stats.totalRedditRequests += 1;
  const code = String(res.status);
  stats.statusCounts[code] = (stats.statusCounts[code] ?? 0) + 1;
  if (!res.ok) {
    stats.failedRedditRequests += 1;
    return;
  }
  stats.successfulRedditRequests += 1;
  if (emptyPayload) stats.emptyResponses += 1;
}

function parseRetryAfterMs(res: Response): number {
  const ra = res.headers.get("retry-after");
  if (ra) {
    const n = Number.parseInt(ra, 10);
    if (Number.isFinite(n)) return Math.min(120_000, Math.max(1000, n * 1000));
  }
  return 5000;
}

export type RedditApiClient = {
  fetchJson(path: string): Promise<Response>;
  scheduler: RedditRequestScheduler;
};

/**
 * OAuth `oauth.reddit.com` JSON fetch with rolling-window throttling and basic 429/401 handling.
 * Path must start with `/` (e.g. `/r/technology/hot.json?limit=8`).
 */
export function createRedditApiClient(
  cfg: RedditIngestEnv,
  oauth: RedditOAuthEnv,
  stats: RedditHttpStats,
  extras: RedditClientExtras,
): RedditApiClient {
  const scheduler = new RedditRequestScheduler(cfg);

  async function oneFetch(path: string, allowRetry: boolean): Promise<Response> {
    const token = await getRedditAccessToken(oauth);
    if (!token) {
      return new Response(JSON.stringify({ error: "oauth_token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const res = await fetch(`https://oauth.reddit.com${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": oauth.userAgent,
      },
      cache: "no-store",
    });

    captureRateHeaders(res.headers, extras.rateLimitHeadersLast);

    if (res.status === 401 && allowRetry) {
      clearRedditTokenCache();
      return oneFetch(path, false);
    }

    if (res.status === 429) {
      extras.backoffTriggered = true;
      await new Promise<void>((r) => setTimeout(r, parseRetryAfterMs(res)));
      if (allowRetry) {
        return oneFetch(path, false);
      }
    }

    return res;
  }

  return {
    scheduler,
    async fetchJson(path: string): Promise<Response> {
      await scheduler.acquireSlot();
      try {
        const res = await oneFetch(path, true);
        return res;
      } finally {
        scheduler.releaseSlot();
      }
    },
  };
}

const PUBLIC_REDDIT_ORIGIN = "https://www.reddit.com";

/**
 * User-Agent is required for Reddit JSON. Uses `REDDIT_USER_AGENT` or `REDDIT_PUBLIC_USER_AGENT`, else a dev default.
 * Interim collector: allows listing/comment fetches without OAuth (public `.json` endpoints).
 */
export function getPublicRedditUserAgent(): string {
  const ua =
    process.env.REDDIT_USER_AGENT?.trim() ??
    process.env.REDDIT_PUBLIC_USER_AGENT?.trim() ??
    "";
  if (ua.length > 0) return ua;
  return "TrendMVP/0.1 (interim Reddit collector; set REDDIT_USER_AGENT for production)";
}

/**
 * Public `www.reddit.com` JSON (no Bearer). Same path shape as OAuth client (`/r/.../hot.json?...`).
 * TEMPORARY fallback until OAuth is configured — rate limits may be stricter.
 */
export function createRedditPublicJsonClient(
  cfg: RedditIngestEnv,
  _stats: RedditHttpStats,
  extras: RedditClientExtras,
): RedditApiClient {
  const scheduler = new RedditRequestScheduler(cfg);
  const userAgent = getPublicRedditUserAgent();

  async function oneFetch(path: string, allowRetry: boolean): Promise<Response> {
    const res = await fetch(`${PUBLIC_REDDIT_ORIGIN}${path}`, {
      headers: {
        "User-Agent": userAgent,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    captureRateHeaders(res.headers, extras.rateLimitHeadersLast);

    if (res.status === 429) {
      extras.backoffTriggered = true;
      await new Promise<void>((r) => setTimeout(r, parseRetryAfterMs(res)));
      if (allowRetry) {
        return oneFetch(path, false);
      }
    }

    return res;
  }

  return {
    scheduler,
    async fetchJson(path: string): Promise<Response> {
      await scheduler.acquireSlot();
      try {
        const res = await oneFetch(path, true);
        return res;
      } finally {
        scheduler.releaseSlot();
      }
    },
  };
}

export function createEmptyRedditResponse(): Response {
  return new Response(JSON.stringify({ error: "reddit_oauth_not_configured" }), {
    status: 503,
    headers: { "Content-Type": "application/json" },
  });
}

/** Record a completed Reddit HTTP response into ingest stats (listing + comment fetches). */
export function recordRedditHttpAttempt(
  stats: RedditHttpStats,
  res: Response,
  emptyPayload: boolean,
): void {
  recordAttempt(stats, res, emptyPayload);
}
