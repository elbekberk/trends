export type TopicConfidence = "low" | "medium" | "high";

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
 * Rule-based score: delta dominates; growth and source spread add small bonuses.
 * Intended to be readable and tunable from this file only.
 */
export function computeParentTopicMetrics(
  current: number,
  previous: number,
  sourceBreakdown: Record<string, number>,
): ParentTopicMetrics {
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

  const score = Math.round((delta + growthBonus + spreadBonus) * 100) / 100;

  let confidence: TopicConfidence = "low";
  if (delta >= 4 && sourceCount >= 2 && current >= 5) {
    confidence = "high";
  } else if (
    delta >= 2 ||
    (sourceCount >= 2 && current >= 3) ||
    current >= 8
  ) {
    confidence = "medium";
  }

  return {
    current,
    previous,
    delta,
    growthRatio: Math.round(growthRatio * 100) / 100,
    sourceCount,
    score,
    confidence,
  };
}
