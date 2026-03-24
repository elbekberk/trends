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
          Fast-rising keywords from Reddit and Hacker News.
        </p>

        {topics.length === 0 ? (
          <div className={styles.empty}>
            <p>No data yet.</p>
            <p>Run a POST request to /api/ingest, then refresh this page.</p>
          </div>
        ) : (
          <div className={styles.list}>
            {topics.map((item) => (
              <article key={item.topic} className={styles.card}>
                <h2>{item.topic}</h2>
                <div className={styles.metrics}>
                  <span>Current: {item.current}</span>
                  <span>Previous: {item.previous}</span>
                  <span>Score: {item.score}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
