import styles from "./page.module.css";

export type TopicCardData = {
  parentKey: string;
  parentLabel: string;
  category: string;
  current: number;
  previous: number;
  score: number;
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

export function TopicCard({ item }: { item: TopicCardData }) {
  return (
    <article className={styles.card}>
      <h2>{item.parentLabel}</h2>
      <div className={styles.metrics}>
        <span>Current: {item.current}</span>
        <span>Previous: {item.previous}</span>
        <span>Score: {item.score}</span>
      </div>
      <div className={styles.meta}>
        <span>Category: {item.category}</span>
        <span>
          Sources:{" "}
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
