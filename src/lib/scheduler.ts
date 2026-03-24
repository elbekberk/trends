import cron from "node-cron";
import { runIngest } from "@/src/lib/ingest";

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
