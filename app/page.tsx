import styles from "./page.module.css";
import { getRisingTopics } from "@/src/lib/ingest";

export const dynamic = "force-dynamic";

export default async function Home() {
  const topics = await getRisingTopics(30);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Rising Topics</h1>
        <p className={styles.subtitle}>
          Phrase-level trends with headline evidence from Reddit and Hacker News.
        </p>

        {topics.length === 0 ? (
          <div className={styles.empty}>
            <p>No data yet.</p>
            <p>Run a POST request to /api/ingest, then refresh this page.</p>
          </div>
        ) : (
          <div className={styles.list}>
            {topics.map((item) => (
              <article key={item.topicKey} className={styles.card}>
                <h2>{item.topicLabel}</h2>
                <div className={styles.metrics}>
                  <span>Current: {item.current}</span>
                  <span>Previous: {item.previous}</span>
                  <span>Score: {item.score}</span>
                </div>
                <div className={styles.meta}>
                  <span>Sources: {item.sources.join(", ") || "n/a"}</span>
                  <span>Last seen: {item.lastSeenAt ?? "n/a"}</span>
                </div>
                {item.evidence.length > 0 && (
                  <ul className={styles.evidence}>
                    {item.evidence.map((e, index) => (
                      <li key={`${item.topicKey}-${index}`}>
                        <strong>[{e.source}]</strong> {e.title}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
