export class MetricsRegistry {
  constructor() {
    this.counters = new Map();
    this.histogramBuckets = [0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0];
    this.histogramCounts = new Map();
    this.histogramSum = 0;
    this.histogramTotalCount = 0;
    for (const b of this.histogramBuckets) {
      this.histogramCounts.set(b, 0);
    }
  }

  incRequest(outcome = 'success') {
    const current = this.counters.get(outcome) || 0;
    this.counters.set(outcome, current + 1);
  }

  observeDuration(seconds) {
    this.histogramTotalCount += 1;
    this.histogramSum += seconds;
    for (const b of this.histogramBuckets) {
      if (seconds <= b) {
        this.histogramCounts.set(b, (this.histogramCounts.get(b) || 0) + 1);
      }
    }
  }

  formatPrometheus() {
    const lines = [];
    lines.push('# HELP messages_requests_total Total messages requests by outcome');
    lines.push('# TYPE messages_requests_total counter');
    for (const [outcome, val] of this.counters.entries()) {
      lines.push(`messages_requests_total{outcome="${outcome}"} ${val}`);
    }
    lines.push('# HELP message_duration_seconds Latency histogram for message processing');
    lines.push('# TYPE message_duration_seconds histogram');
    for (const b of this.histogramBuckets) {
      lines.push(`message_duration_seconds_bucket{le="${b}"} ${this.histogramCounts.get(b) || 0}`);
    }
    lines.push(`message_duration_seconds_bucket{le="+Inf"} ${this.histogramTotalCount}`);
    lines.push(`message_duration_seconds_sum ${this.histogramSum.toFixed(4)}`);
    lines.push(`message_duration_seconds_count ${this.histogramTotalCount}`);
    return lines.join('\n') + '\n';
  }
}
