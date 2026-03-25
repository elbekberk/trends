import type { RedditOAuthEnv } from "@/src/lib/reddit/redditEnv";

type CachedToken = {
  accessToken: string;
  expiresAtMs: number;
};

let cache: CachedToken | null = null;

function basicAuthHeader(clientId: string, clientSecret: string): string {
  const raw = `${clientId}:${clientSecret}`;
  if (typeof Buffer !== "undefined") {
    return `Basic ${Buffer.from(raw, "utf8").toString("base64")}`;
  }
  return `Basic ${btoa(raw)}`;
}

/**
 * OAuth2 refresh-token flow for Reddit script/app credentials.
 * Returns `null` if refresh fails (caller should surface health warnings).
 */
export async function getRedditAccessToken(env: RedditOAuthEnv): Promise<string | null> {
  const now = Date.now();
  if (cache && cache.expiresAtMs > now + 30_000) {
    return cache.accessToken;
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: env.refreshToken,
  });

  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: basicAuthHeader(env.clientId, env.clientSecret),
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": env.userAgent,
    },
    body,
    cache: "no-store",
  });

  if (!res.ok) {
    cache = null;
    return null;
  }

  let data: { access_token?: string; expires_in?: number };
  try {
    data = (await res.json()) as { access_token?: string; expires_in?: number };
  } catch {
    cache = null;
    return null;
  }

  const accessToken = data.access_token;
  if (typeof accessToken !== "string" || accessToken.length === 0) {
    cache = null;
    return null;
  }

  const expiresInSec = typeof data.expires_in === "number" ? data.expires_in : 3600;
  cache = {
    accessToken,
    expiresAtMs: now + expiresInSec * 1000 - 60_000,
  };
  return accessToken;
}

/** Clear cached token (e.g. after 401 from oauth.reddit.com). */
export function clearRedditTokenCache(): void {
  cache = null;
}

/** Test-only: clear cached token. */
export function __resetRedditTokenCacheForTests(): void {
  cache = null;
}
