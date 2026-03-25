import styles from "./page.module.css";
import type { TopicConfidence } from "@/src/lib/topicScore";
import type { TopicAnalytics } from "@/src/lib/ingest";

export type TopicCardData = {
  parentKey: string;
  parentLabel: string;
  category: string;
  current: number;
  previous: number;
  delta: number;
  growthRatio: number;
  sourceCount: number;
  score: number;
  confidence: TopicConfidence;
  sourceBreakdown: Record<string, number>;
  lastSeenAt: string | null;
  /** Full observability payload from `getRisingTopics` (optional for older callers). */
  analytics?: TopicAnalytics;
  children: Array<{
    childKey: string;
    childLabel: string;
    count: number;
    evidence: Array<{
      source: string;
      title: string;
      timestamp: string;
      url: string | null;
    }>;
  }>;
};

function confidenceClass(c: TopicConfidence) {
  if (c === "high") return styles.confidenceHigh;
  if (c === "medium") return styles.confidenceMedium;
  return styles.confidenceLow;
}

export function TopicCard({ item }: { item: TopicCardData }) {
  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <h2>{item.parentLabel}</h2>
        <span className={`${styles.confidence} ${confidenceClass(item.confidence)}`}>
          {item.confidence} confidence
        </span>
      </div>

      <div className={styles.scoreRow}>
        <span className={styles.primaryScore}>Score {item.score}</span>
        <span className={styles.scoreHint}>
          delta + growth + spread + discussion (capped)
        </span>
      </div>

      <div className={styles.metrics}>
        <span>Δ {item.delta >= 0 ? "+" : ""}
          {item.delta}
        </span>
        <span>Growth ×{item.growthRatio}</span>
        <span>Current {item.current}</span>
        <span>Previous {item.previous}</span>
        <span>Sources {item.sourceCount}</span>
      </div>

      <div className={styles.meta}>
        <span>Category: {item.category}</span>
        <span>
          Breakdown:{" "}
          {Object.entries(item.sourceBreakdown)
            .map(([source, count]) => `${source} (${count})`)
            .join(", ") || "n/a"}
        </span>
        <span>Last seen: {item.lastSeenAt ?? "n/a"}</span>
      </div>

      {item.analytics ? (
        <details className={`${styles.details} ${styles.detailsAnalytics}`}>
          <summary>Analytics (debug)</summary>
          <div className={styles.analyticsPanel}>
            <h3 className={styles.analyticsSubhead}>Score breakdown</h3>
            <pre className={styles.analyticsPre}>
              {JSON.stringify(item.analytics.scoreBreakdown, null, 2)}
            </pre>
            <p className={styles.analyticsNote}>
              Base score = round((delta + growth + spread)×100)/100; total = base + discussion
              (log₁₀(discussionScore+1)×0.5, max 3; if current is below 3 and Δ≤0, discussion is capped at
              1.5). {item.analytics.discussionScoringNote}
            </p>

            <h3 className={styles.analyticsSubhead}>Counts &amp; growth</h3>
            <ul className={styles.analyticsList}>
              <li>current {item.analytics.current} · previous {item.analytics.previous}</li>
              <li>delta {item.analytics.delta} · growthRatio {item.analytics.growthRatio}</li>
              <li>sourceCount {item.analytics.sourceCount}</li>
              <li>childCount {item.analytics.childCount} · evidenceCount {item.analytics.evidenceCount}</li>
              <li>discussionScore (API comments + stored snippets sum) {item.analytics.discussionScore}</li>
              <li>totalRedditScore (sum post scores) {item.analytics.totalRedditScore}</li>
              <li>totalNumComments (API only, summed) {item.analytics.totalNumComments}</li>
              <li>sampledCommentCount {item.analytics.sampledCommentCount}</li>
            </ul>

            <h3 className={styles.analyticsSubhead}>Source breakdown</h3>
            <pre className={styles.analyticsPre}>
              {JSON.stringify(item.analytics.sourceBreakdown, null, 2)}
            </pre>

            <h3 className={styles.analyticsSubhead}>Discussion</h3>
            <p className={styles.analyticsMuted}>keywords: {item.analytics.discussionKeywords.join(", ") || "—"}</p>
            {item.analytics.sampleComments.length > 0 ? (
              <ul className={styles.analyticsComments}>
                {item.analytics.sampleComments.map((c, i) => (
                  <li key={i}>
                    <blockquote className={styles.sampleComment}>{c}</blockquote>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.analyticsMuted}>No stored comment snippets.</p>
            )}

            <h3 className={styles.analyticsSubhead}>Parents &amp; merge</h3>
            <ul className={styles.analyticsList}>
              <li>displayParentKey: {item.analytics.displayParentKey}</li>
              <li>displayParentLabel: {item.analytics.displayParentLabel}</li>
              <li>canonicalParentKey: {item.analytics.canonicalParentKey ?? "—"}</li>
              <li>canonicalParentLabel: {item.analytics.canonicalParentLabel ?? "—"}</li>
            </ul>
            {item.analytics.mergedParentFragments.length > 0 ? (
              <>
                <p className={styles.analyticsMuted}>Merged parent fragments (absorbed keys)</p>
                <pre className={styles.analyticsPre}>
                  {JSON.stringify(item.analytics.mergedParentFragments, null, 2)}
                </pre>
              </>
            ) : (
              <p className={styles.analyticsMuted}>No extra merged parent keys beyond display parent.</p>
            )}
          </div>
        </details>
      ) : null}

      <details className={styles.details}>
        <summary>Child developments ({item.children.length})</summary>
        {item.children.length === 0 ? (
          <p className={styles.noChildren}>No child developments yet.</p>
        ) : (
          <div className={styles.children}>
            {item.children.map((child) => (
              <section
                key={`${item.parentKey}-${child.childKey}`}
                className={styles.childBlock}
              >
                <h3>{child.childLabel}</h3>
                <p className={styles.childCount}>Mentions: {child.count}</p>
                <ul className={styles.evidence}>
                  {child.evidence.map((e, index) => (
                    <li key={`${child.childKey}-${index}`}>
                      <strong>[{e.source}]</strong>{" "}
                      {e.url ? (
                        <a href={e.url} target="_blank" rel="noreferrer">
                          {e.title}
                        </a>
                      ) : (
                        e.title
                      )}{" "}
                      <span className={styles.timestamp}>({e.timestamp})</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </details>
    </article>
  );
}
