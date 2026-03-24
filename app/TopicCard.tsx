import styles from "./page.module.css";
import type { TopicConfidence } from "@/src/lib/topicScore";

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
        <span className={styles.scoreHint}>delta + growth bonus + source spread</span>
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
