export type TopicConfidence = "low" | "medium" | "high";

/** Raw components that sum (before final rounding) into the base topic score. */
export type ParentTopicScoreComponents = {
  delta: number;
  growthBonus: number;
  spreadBonus: number;
  /** `Math.round((delta + growthBonus + spreadBonus) * 100) / 100` */
  baseScore: number;
};

export type ParentTopicMetrics = {
  current: number;
  previous: number;
  delta: number;
  growthRatio: number;
  sourceCount: number;
  score: number;
  confidence: TopicConfidence;
};

/**
 * Exposes the same numbers used inside `computeParentTopicMetrics` for observability.
 */
export function computeParentTopicScoreComponents(
  current: number,
  previous: number,
  sourceBreakdown: Record<string, number>,
): ParentTopicScoreComponents {
  const delta = current - previous;
  const growthRatio = current / Math.max(previous, 1);
  const sourceCount = Object.keys(sourceBreakdown).length;

  let growthBonus = 0;
  if (previous > 0) {
    growthBonus = Math.min(5, (growthRatio - 1) * 2);
  } else {
    growthBonus = Math.min(3, current * 0.15);
  }

  const spreadBonus = Math.min(2, Math.max(0, sourceCount - 1));
  const baseScore = Math.round((delta + growthBonus + spreadBonus) * 100) / 100;

  return { delta, growthBonus, spreadBonus, baseScore };
}

/**
 * Rule-based score: delta dominates; growth and source spread add small bonuses.
 * Intended to be readable and tunable from this file only.
 */
export function computeParentTopicMetrics(
  current: number,
  previous: number,
  sourceBreakdown: Record<string, number>,
): ParentTopicMetrics {
  const growthRatio = current / Math.max(previous, 1);
  const sourceCount = Object.keys(sourceBreakdown).length;
  const components = computeParentTopicScoreComponents(current, previous, sourceBreakdown);

  const score = components.baseScore;

  let confidence: TopicConfidence = "low";
  if (components.delta >= 4 && sourceCount >= 2 && current >= 5) {
    confidence = "high";
  } else if (
    components.delta >= 2 ||
    (sourceCount >= 2 && current >= 3) ||
    current >= 8
  ) {
    confidence = "medium";
  }

  return {
    current,
    previous,
    delta: components.delta,
    growthRatio: Math.round(growthRatio * 100) / 100,
    sourceCount,
    score,
    confidence,
  };
}

/** Hard ceiling on discussion contribution (secondary ranking signal). */
export const DISCUSSION_CONTRIBUTION_CAP = 3;

/** Shown in analytics/debug; keep in sync with `discussionScoreContribution`. */
export const DISCUSSION_SCORING_NOTE =
  "Discussion boost is capped and treated as a secondary signal.";

/** Optional context to avoid over-rewarding high comment volume when the topic is quiet or flat. */
export type DiscussionScoreContext = {
  current: number;
  delta: number;
};

/**
 * Secondary signal: softer than raw ln(score+1). Uses log10(discussionScore+1)×0.5, capped at
 * {@link DISCUSSION_CONTRIBUTION_CAP}. Comments are not used for topic detection.
 */
export function discussionScoreContribution(
  discussionScore: number,
  context?: DiscussionScoreContext,
): number {
  let raw = Math.log10(Math.max(0, discussionScore) + 1) * 0.5;
  raw = Math.min(DISCUSSION_CONTRIBUTION_CAP, raw);
  if (context && context.current < 3 && context.delta <= 0) {
    raw = Math.min(raw, 1.5);
  }
  return Math.round(raw * 100) / 100;
}

/** Total topic score = baseScore + discussion contribution (same rounding as ingest). */
export function scoreWithDiscussionBonus(
  baseScore: number,
  discussionScore: number,
  context?: DiscussionScoreContext,
): number {
  const bonus = discussionScoreContribution(discussionScore, context);
  return Math.round((baseScore + bonus) * 100) / 100;
}
