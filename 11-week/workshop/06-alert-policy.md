# Multi-Window Multi-Burn-Rate Alerting Policy - EduTrack Platform

## 1. Quantitative Budget Consumption Breakdown

Multi-window multi-burn-rate alerting eliminates noisy threshold alerts and false alarms by evaluating both a long lookback window (ensuring significant consumption) and a short lookback window (verifying the incident is actively occurring).

With a 30-day (720 hours) availability SLO of **99.5%**, the error budget rate is 1 - 0.995 = 0.005.

| Alert Type | Burn Rate Multiplier | Long Window | Short Window | Budget Consumed Before Alert | Incident Time to Exhaust Budget | Severity / Channel |
|:---|:---:|:---:|:---:|:---:|:---:|:---|
| **Fast Burn (Critical)** | **14.4x** | 1 hour | 5 minutes | **2.0%** (30 failed requests) | 50.0 hours (~2.1 days) | PagerDuty / P0 Escalation |
| **Slow Burn (Warning)** | **6.0x** | 6 hours | 30 minutes | **5.0%** (75 failed requests) | 120.0 hours (5.0 days) | Slack Ticket / Daily Standup |

---

## 2. Anti-Pattern Guardrails: Cause-Based Alerts We DO NOT Create

To preserve engineer focus and prevent alert fatigue, EduTrack strictly enforces symptom-based SLO alerting and prohibits the following cause-based anti-patterns:

1. **High CPU Utilization Alert (`cpu_usage > 85%`):**
   - *Why Prohibited:* A spike in CPU during high-throughput garbage collection or intensive JSON cryptographic signing does not imply client-facing failure. If response times remain under 500ms and requests succeed, alerting the team at night for raw CPU creates needless alert fatigue.
   - *Proper Replacement:* Track latency p95 and HTTP 5xx error rate; CPU is investigated as telemetry during triage, never as a pager alarm.

2. **Memory Usage Threshold Alert (`jvm_memory_used > 90%`):**
   - *Why Prohibited:* Contemporary Java/Node.js runtimes greedily allocate virtual memory and defer garbage collection until necessary. Triggering alerts on memory consumption without correlating actual OutOfMemory (OOM) failures or GC pause latency leads to constant false positives.
   - *Proper Replacement:* Track saturation via database connection pool wait queues and JVM garbage collection pause durations (`jvm_gc_pause_seconds`).
