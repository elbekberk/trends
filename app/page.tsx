import styles from "./page.module.css";
import { getRisingTopics } from "@/src/lib/ingest";
import Link from "next/link";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams?: Promise<{ category?: string }>;
};

const CATEGORIES = ["all", "geopolitics", "technology", "economy", "general"] as const;

export default async function Home({ searchParams }: HomeProps) {
  const params = (await searchParams) ?? {};
  const activeCategory = CATEGORIES.includes((params.category as typeof CATEGORIES[number]) ?? "all")
    ? ((params.category as typeof CATEGORIES[number]) ?? "all")
    : "all";

  const radar = await getRisingTopics(30);
  const topics =
    activeCategory === "all"
      ? radar.topics
      : radar.topics.filter((topic) => topic.category === activeCategory);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Trend Radar</h1>
        <p className={styles.subtitle}>
          Parent topics with child developments and evidence from Reddit and Hacker News.
        </p>
        <nav className={styles.filters}>
          {CATEGORIES.map((category) => (
            <Link
              key={category}
              href={category === "all" ? "/" : `/?category=${category}`}
              className={activeCategory === category ? styles.filterActive : styles.filter}
            >
              {category}
            </Link>
          ))}
        </nav>

        {topics.length === 0 ? (
          <div className={styles.empty}>
            <p>No data yet.</p>
            <p>Run a POST request to /api/ingest, then refresh this page.</p>
          </div>
        ) : (
          <div className={styles.list}>
            {topics.map((item) => (
              <article key={item.parentKey} className={styles.card}>
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
                        <section key={`${item.parentKey}-${child.childKey}`} className={styles.childBlock}>
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
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
