import type { RedditIngestEnv } from "@/src/lib/reddit/redditEnv";

/**
 * Request pacing for Reddit: bounded concurrency + minimum spacing + jitter.
 * Does NOT impose a fixed "requests per minute" cap — global volume is controlled by the
 * adaptive listing/comment budget gate in the collector layer.
 */
export class RedditRequestScheduler {
  private readonly minDelayMs: number;
  private readonly jitterMs: number;
  private readonly enableJitter: boolean;
  private readonly maxConcurrent: number;

  private lastDispatchAt = 0;
  private active = 0;

  constructor(cfg: RedditIngestEnv) {
    this.minDelayMs = cfg.minDelayMs;
    this.jitterMs = cfg.jitterMs;
    this.enableJitter = cfg.enableJitter;
    this.maxConcurrent = cfg.maxConcurrency;
  }

  async acquireSlot(): Promise<void> {
    for (;;) {
      if (this.active < this.maxConcurrent) break;
      await new Promise<void>((r) => setTimeout(r, 20));
    }
    this.active += 1;
    try {
      await this.waitSpacing();
    } catch (e) {
      this.active -= 1;
      throw e;
    }
  }

  releaseSlot(): void {
    this.active = Math.max(0, this.active - 1);
  }

  private async waitSpacing(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastDispatchAt;
    const jitter = this.enableJitter
      ? Math.floor(Math.random() * (this.jitterMs + 1))
      : 0;
    const need = Math.max(0, this.minDelayMs + jitter - elapsed);
    if (need > 0) {
      await new Promise<void>((r) => setTimeout(r, need));
    }
    this.lastDispatchAt = Date.now();
  }
}
