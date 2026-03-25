import type { RedditIngestEnv } from "@/src/lib/reddit/redditEnv";
import type { RedditSourcePool } from "@/src/lib/reddit/types";

/**
 * Selective comment snippet fetch: enrichment only; keep volume bounded.
 * Requires `numComments > 0` when known; `null` is treated as unknown (still gated by score/comment heuristics).
 */
export function shouldFetchCommentSnippets(
  pool: RedditSourcePool,
  score: number | null,
  numComments: number | null,
  env: RedditIngestEnv,
): boolean {
  if (numComments === 0) return false;

  const relaxed = env.commentRelaxPools.includes(pool);
  const minS = relaxed ? env.commentRelaxedMinScore : env.commentMinScore;
  const minC = relaxed ? env.commentRelaxedMinComments : env.commentMinComments;

  const s = score ?? 0;
  const c = numComments ?? 0;

  if (numComments == null) {
    return s >= minS;
  }

  return s >= minS || c >= minC;
}
