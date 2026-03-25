/**
 * Interim listing vs comment HTTP slots for the adaptive collector.
 * Listing calls and comment calls compete only within their own buckets.
 */

export class RedditHttpBudgetGate {
  listingRemaining: number;
  commentRemaining: number;

  constructor(listingSlots: number, commentSlots: number) {
    this.listingRemaining = Math.max(0, listingSlots);
    this.commentRemaining = Math.max(0, commentSlots);
  }

  tryConsumeListing(): boolean {
    if (this.listingRemaining <= 0) return false;
    this.listingRemaining -= 1;
    return true;
  }

  tryConsumeComment(): boolean {
    if (this.commentRemaining <= 0) return false;
    this.commentRemaining -= 1;
    return true;
  }
}
