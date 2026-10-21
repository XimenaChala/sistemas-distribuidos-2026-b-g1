<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       11-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 11

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Ximena Del Pilar Zambrano Chala
- GITHUB_USER: XimenaChala
- TEAM: EduTrack
- SPRINT_GOAL: Observability, Distributed Tracing, Structured Logging, and Golden Signals Instrumentation (Week 11 - Delivery 1)
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| CP0 | Workshop Setup and Canonical Configuration | done | https://github.com/XimenaChala/sistemas-distribuidos-2026-b-g1/commit/b3cf3fa |
| CP1 | Critical Journey and Distributed Trace Map | done | https://github.com/XimenaChala/sistemas-distribuidos-2026-b-g1/commit/ef8f12b |
| CP2 | Structured Log Contract and Masking Rules | done | https://github.com/XimenaChala/sistemas-distribuidos-2026-b-g1/commit/bfedb88 |
| CP3 | Instrumentation Middleware, Downstream Call and Metrics | done | https://github.com/XimenaChala/sistemas-distribuidos-2026-b-g1/commit/293094d |
| CP4 | Golden Signals and Prometheus Metric Catalog | done | https://github.com/XimenaChala/sistemas-distribuidos-2026-b-g1/tree/main/11-week/workshop/04-metrics.md |
| CP5 | Delivery 1 Closure and Weekly Status Update | done | https://github.com/XimenaChala/sistemas-distribuidos-2026-b-g1/tree/main/11-week/hu-status |

## 2. My individual contribution
- Mapped end-to-end critical journey for parent-teacher messaging across 5 real EduTrack components.
- Established W3C trace context propagation across sync HTTP and async RabbitMQ broker boundaries.
- Authored structured JSON log schema with 11 standard fields, 4 domain attributes, and sensitive data redaction.
- Implemented and unit-tested trace middleware, structured logger, and downstream context forwarder.
- Cataloged the 4 golden signals with Prometheus queries and cardinality controls.

## 3. Blockers and risks
- High cardinality risks in Prometheus avoided by replacing unbounded identifiers with bounded roles.

## 4. Plan for next week
- Complete Delivery 2 (CP6 to CP10): SLOs, error budgets, burn rate alerts, runbook, and drill postmortem.

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
