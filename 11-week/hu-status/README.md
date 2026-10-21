<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       11-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 11

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Ximena Del Pilar Zambrano Chala
- GITHUB_USER: XimenaChala
- TEAM: EduTrack
- SPRINT_GOAL: Complete Delivery 1 & Delivery 2: Observability, Distributed Tracing, SLOs, Multi-Window Burn Rate Alerts, Runbooks, and Postmortems
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| CP0 | Workshop Setup and Canonical Configuration | done | https://github.com/XimenaChala/sistemas-distribuidos-2026-b-g1/commit/b3cf3fa |
| CP1 | Critical Journey and Distributed Trace Map | done | https://github.com/XimenaChala/sistemas-distribuidos-2026-b-g1/commit/ef8f12b |
| CP2 | Structured Log Contract and Masking Rules | done | https://github.com/XimenaChala/sistemas-distribuidos-2026-b-g1/commit/bfedb88 |
| CP3 | Instrumentation Middleware, Downstream Call and Metrics | done | https://github.com/XimenaChala/sistemas-distribuidos-2026-b-g1/commit/293094d |
| CP4 | Golden Signals and Prometheus Metric Catalog | done | https://github.com/XimenaChala/sistemas-distribuidos-2026-b-g1/commit/2d48e2c |
| CP5 | Delivery 1 Closure and Weekly Status Update | done | https://github.com/XimenaChala/sistemas-distribuidos-2026-b-g1/commit/ca7adb0 |
| CP6 | SLIs, SLOs and Error Budget Definition | done | https://github.com/XimenaChala/sistemas-distribuidos-2026-b-g1/commit/6bfe606 |
| CP7 | Multi-Window Multi-Burn-Rate Alerting Rules | done | https://github.com/XimenaChala/sistemas-distribuidos-2026-b-g1/commit/5c9f85d |
| CP8 | Fast-Burn Operational Incident Runbook | done | https://github.com/XimenaChala/sistemas-distribuidos-2026-b-g1/commit/f70dd59 |
| CP9 | Incident Simulation and Blameless Postmortem | done | https://github.com/XimenaChala/sistemas-distribuidos-2026-b-g1/commit/bfe0a41 |
| CP10 | Delivery 2 Closure and Final Implementation Plan | done | https://github.com/XimenaChala/sistemas-distribuidos-2026-b-g1/tree/main/11-week/hu-status |

## 2. My individual contribution
- Mapped end-to-end critical journey for parent-teacher messaging across 5 real EduTrack components.
- Established W3C trace context propagation across sync HTTP and async RabbitMQ broker boundaries.
- Defined uniform structured JSON log contract with 11 standard fields, 4 domain attributes, and sensitive data redaction.
- Implemented and unit-tested trace middleware, structured logger, and downstream context forwarder for educk-communication-api.
- Cataloged the 4 golden signals with Prometheus queries and cardinality controls.
- Defined 3 30-day SLOs (availability, latency, and event delivery) with rolling error budgets and consumption governance policies.
- Formulated multi-window multi-burn-rate Prometheus alert rules (14.4x fast burn and 6x slow burn) with symptom-based anti-pattern guardrails.
- Authored step-by-step operational runbook with diagnostic PromQL, logcli queries, and tiered mitigation actions.
- Simulated downstream storage degradation incident, calculating exact SLI impact, timeline, and blameless postmortem action items.

## 3. Blockers and risks
- High cardinality risks in Prometheus avoided by replacing unbounded identifiers with bounded roles.
- Addressed database pool starvation risk by designing non-blocking circuit breaker fallback during high latency incidents.

## 4. Plan for next week
- Implement recommended Flyway composite indexes on conversation threads and configure Prometheus scraping in live Docker Compose cluster.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [x] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [x] Tests added/updated (unit / integration)
- [x] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
- Fork repository: https://github.com/XimenaChala/sistemas-distribuidos-2026-b-g1
- Workshop directory: https://github.com/XimenaChala/sistemas-distribuidos-2026-b-g1/tree/main/11-week/workshop
- Reflection document: https://docs.google.com/document/d/1Zwt8yZUGCmxLZV0C0fcBGwV-YRliqTCMxc9CDnUGc7A/edit
