import styles from "./page.module.css";
import { getRisingTopics } from "@/src/lib/ingest";
import Link from "next/link";
import { TopicCard } from "./TopicCard";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams?: Promise<{ category?: string }>;
};

const CATEGORIES = ["all", "geopolitics", "technology", "economy", "general"] as const;

const LANE_TITLES: Record<Exclude<(typeof CATEGORIES)[number], "all">, string> = {
  geopolitics: "Top geopolitics",
  technology: "Top technology",
  economy: "Top economy",
  general: "Top general",
};

export default async function Home({ searchParams }: HomeProps) {
  const params = (await searchParams) ?? {};
  const activeCategory = CATEGORIES.includes(
    (params.category as (typeof CATEGORIES)[number]) ?? "all",
  )
    ? ((params.category as (typeof CATEGORIES)[number]) ?? "all")
    : "all";

  const radar = await getRisingTopics(80);
  const filteredTopics =
    activeCategory === "all"
      ? []
      : radar.allTopics.filter((topic) => topic.category === activeCategory).slice(0, 40);

  const empty = !radar.bucketTime || radar.allTopics.length === 0;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Trend Radar</h1>
        <p className={styles.subtitle}>
          Canonical parent topics with child developments and evidence from Reddit and Hacker News.
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

        {empty ? (
          <div className={styles.empty}>
            <p>No data yet.</p>
            <p>Run a POST request to /api/ingest, then refresh this page.</p>
          </div>
        ) : activeCategory === "all" ? (
          <>
            <section className={styles.laneSection}>
              <h2 className={styles.laneHeading}>{LANE_TITLES.geopolitics}</h2>
              <div className={styles.list}>
                {radar.lanes.geopolitics.map((item) => (
                  <TopicCard key={item.parentKey} item={item} />
                ))}
              </div>
            </section>
            <section className={styles.laneSection}>
              <h2 className={styles.laneHeading}>{LANE_TITLES.technology}</h2>
              <div className={styles.list}>
                {radar.lanes.technology.map((item) => (
                  <TopicCard key={item.parentKey} item={item} />
                ))}
              </div>
            </section>
            <section className={styles.laneSection}>
              <h2 className={styles.laneHeading}>{LANE_TITLES.economy}</h2>
              <div className={styles.list}>
                {radar.lanes.economy.map((item) => (
                  <TopicCard key={item.parentKey} item={item} />
                ))}
              </div>
            </section>
            <section className={styles.laneSection}>
              <h2 className={styles.laneHeading}>{LANE_TITLES.general}</h2>
              <div className={styles.list}>
                {radar.lanes.general.map((item) => (
                  <TopicCard key={item.parentKey} item={item} />
                ))}
              </div>
            </section>

            <section className={styles.laneSection}>
              <h2 className={styles.laneHeading}>All topics (top {radar.topics.length})</h2>
              <div className={styles.list}>
                {radar.topics.map((item) => (
                  <TopicCard key={`all-${item.parentKey}`} item={item} />
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className={styles.list}>
            {filteredTopics.length === 0 ? (
              <p className={styles.empty}>No topics in this category for the latest bucket.</p>
            ) : (
              filteredTopics.map((item) => <TopicCard key={item.parentKey} item={item} />)
            )}
          </div>
        )}
      </div>
    </main>
  );
}
