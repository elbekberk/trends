import cron from "node-cron";
import { runIngest } from "@/src/lib/ingest";

/** Server-side ingest driver — unrelated to the browser `GET /api/ingest/latest` poller. */
const globalForScheduler = globalThis as unknown as {
  risingTopicsSchedulerStarted?: boolean;
};

export function startScheduler() {
  if (globalForScheduler.risingTopicsSchedulerStarted) return;
  globalForScheduler.risingTopicsSchedulerStarted = true;

  cron.schedule("0 */2 * * *", async () => {
    try {
      await runIngest();
    } catch (error) {
      console.error("Scheduled ingest failed:", error);
    }
  });
}
