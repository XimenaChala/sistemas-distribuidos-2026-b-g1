# Incident Simulation and Blameless Postmortem - EduTrack

## 1. Incident Scenario Description
During peak afternoon communication hours, `educk-communication-db` experienced severe storage volume latency and connection lock contention. As a result, the downstream database call from `educk-communication-api` responded with a **3.0-second delay for 25% of requests over a 40-minute duration**.

---

## 2. Distributed Trace of a Slow Request (`trace_id: 4bf92f3577b34da6a3ce929d0e0e4736`)

```text
[Root Span] educk-api-gateway: POST /api/v1/messages (3,052ms)
│
├── [Child Span 1] educk-communication-api: Process Message Command (3,044ms)
│   │
│   ├── [Child Span 1.1] educk-communication-db: INSERT INTO messages (3,018ms) ⚠️ LATENCY DEGRADATION
│   │
│   └── [Child Span 1.2] educk-communication-api: AMQP publish MessageSentEvent (12ms)
│
└── [Child Span 2] educk-worker: AMQP consume MessageSentEvent (14ms)
```

---

## 3. Four Correlated Structured Logs (Format CP2)

```json
{"timestamp":"2026-10-21T14:15:02.100Z","level":"INFO","service":"educk-api-gateway","version":"2.0.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"00f067aa0ba902b7","correlation_id":"corr-msg-9921","event":"http.request.routed","message":"Inbound message dispatched to communication service","duration_ms":4,"sender_id":"u-parent-410","recipient_id":"u-teacher-88","student_id":"s-1201","message_id":"MSG-90124"}
{"timestamp":"2026-10-21T14:15:02.105Z","level":"WARN","service":"educk-communication-api","version":"2.0.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"5c84a86b3e77f012","correlation_id":"corr-msg-9921","event":"db.connection.slow","message":"Database response exceeded 1000ms threshold","duration_ms":1040,"sender_id":"u-parent-410","recipient_id":"u-teacher-88","student_id":"s-1201","message_id":"MSG-90124"}
{"timestamp":"2026-10-21T14:15:05.123Z","level":"INFO","service":"educk-communication-api","version":"2.0.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"a182f4bc39e10d54","correlation_id":"corr-msg-9921","event":"db.insert.completed","message":"Message row persisted after connection pool delay","duration_ms":3018,"sender_id":"u-parent-410","recipient_id":"u-teacher-88","student_id":"s-1201","message_id":"MSG-90124"}
{"timestamp":"2026-10-21T14:15:05.140Z","level":"INFO","service":"educk-communication-api","version":"2.0.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"3d91ca82bb4560ea","correlation_id":"corr-msg-9921","event":"amqp.event.published","message":"MessageSentEvent published to exchange","duration_ms":12,"sender_id":"u-parent-410","recipient_id":"u-teacher-88","student_id":"s-1201","message_id":"MSG-90124"}
```

---

## 4. SLI Impact and Alert Trigger Timeline

1. **SLI Impact:**
   - Total requests during 40-minute window: 280 requests.
   - Affected requests (25% delayed by 3.0s > 500ms): **70 requests**.
   - Latency SLI (p95 <= 500ms) drops from **98.4% to 75.0%**, breaching the 95.0% SLO target.
2. **Alert Trigger:**
   - At **Minute 7**, `CommunicationApiAvailabilityFastBurn` fired as the sustained degradation exceeded the 5-minute confirmation window.
3. **Runbook Mitigation Executed:**
   - At **Minute 14**, on-call executed Runbook **Step 3 (Mitigation 1)**, enabling buffer queue mode in Redis and executing pool expansion on PostgreSQL, recovering latency to 180ms.

---

## 5. Blameless Postmortem Report

- **Date:** 2026-10-21
- **Severity:** P1 (Core Journey Latency Degradation)
- **Impact:** 70 parents experienced 3-second UI latency; 0.46% of monthly error budget consumed; 0 messages lost.
- **Root Cause:** Lock contention on the unindexed `messages.conversation_thread_id` foreign key under concurrent batch inserts.
- **Contributing Factors:** High concurrent volume from afternoon teacher broadcast announcements.

### Remediation Action Items (User Stories):
1. **HU-COMMS-OPT1 (Composite DB Indexing):**
   *As an* engineer, *I want* to add a composite index on `(conversation_thread_id, created_at)` in `educk-communication-db` Flyway migrations *so that* message lookups and insertions complete in <50ms under high concurrency.
   *Acceptance Criteria:* `EXPLAIN ANALYZE` on insert and thread query performs index scan; execution time <30ms.

2. **HU-RESIL-02 (Database Connection Pool Tuning):**
   *As an* engineer, *I want* HikariCP connection pool timeout capped at 1,500ms with circuit breaker fallback *so that* cascading connection exhaustion is stopped immediately.
   *Acceptance Criteria:* Under artificial 3s DB lag, circuit breaker trips after 5 slow calls and routes to local buffer.

3. **HU-ALERT-03 (Automated Thread-Lock Metrics):**
   *As an* on-call engineer, *I want* Prometheus gauges tracking PostgreSQL active locks *so that* lock contention is detected prior to user latency breach.
   *Acceptance Criteria:* `pg_locks_active_count` exported and mapped to Grafana dashboard.
