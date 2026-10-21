# Incident Runbook: Communication API Fast-Burn Alert

## 1. Alert Overview and Symptoms
- **Triggering Alert:** `CommunicationApiAvailabilityFastBurn`
- **Condition:** Availability burn rate exceeds **14.4x** across 1-hour and 5-minute windows.
- **Service:** `educk-communication-api` (:8085)
- **User Symptoms:** Parents and teachers attempting to send messages through `educk-communication-portal` receive HTTP 500/504 errors or infinite spinners. Message thread updates stall.

---

## 2. Immediate Diagnostic Triage (Minutes 0 - 5)

### Step 2.1: Confirm Real Impact via PromQL
Execute in Prometheus / Grafana explore console:
```promql
sum(rate(messages_requests_failed_total{status_code=~"5.."}[5m])) / sum(rate(messages_requests_total[5m]))
```
- If error ratio is > 7.2% (14.4 * 0.005), the incident is active and severe.

### Step 2.2: Extract Causality via Distributed Trace Log Query
Filter logs in Grafana Loki or CLI:
```bash
logcli query '{service="educk-communication-api", environment="qa"} |= "ERROR"' --limit=5
```
Locate the offending `trace_id` and query across all components:
```bash
logcli query '{environment="qa"} |= "4bf92f3577b34da6a3ce929d0e0e4736"'
```

---

## 3. Mitigations Ordered by Risk Level

### Mitigation 1 (Lowest Risk): Enable Degraded Queue Mode via Feature Flag
- **Action:** If `educk-communication-db` is saturated, switch API to buffer messages in local Redis/AMQP memory for delayed insertion.
- **Command:**
  ```bash
  curl -X POST http://localhost:8085/api/v1/management/features/buffer-mode -d '{"enabled":true}'
  ```
- **Risk:** Minimal. Guarantees zero message loss while relieving write pressure on PostgreSQL.

### Mitigation 2 (Medium Risk): Scale Service Replicas & Expand DB Connection Pool
- **Action:** If traffic surged, increase container instances and temporary pool capacity.
- **Command:**
  ```bash
  docker compose scale educk-communication-api=3
  ```
- **Risk:** Moderate. May increase database connection count; monitor PostgreSQL `max_connections`.

### Mitigation 3 (High Risk): Immediate Deployment Rollback
- **Action:** If the incident began immediately following a release, revert to the last stable tag (`v2.0.0-stable`).
- **Command:**
  ```bash
  git checkout tags/v2.0.0-stable && docker compose up -d --build educk-communication-api
  ```
- **Risk:** High. Reverts any database schema changes introduced in the latest migration.

---

## 4. Escalation Matrix

| Window | Role | Assigned Engineer | Channel | Responsibility |
|:---|:---|:---|:---|:---|
| **0 - 10 min** | Primary On-Call | Ximena Del Pilar Zambrano | `#incident-comms` | Initial triage, diagnosis, and mitigation execution. |
| **10 - 20 min** | Database / Infra Lead | Diego Rojas / Tech Staff | Phone / Direct Call | PostgreSQL deadlocks, connection starvation, broker queues. |
| **> 20 min** | Academic Incident Manager | Academic Coordinator | Institutional Call | Stakeholder notification to school directors and parent portals. |

---

## 5. Verification of Service Recovery
1. Error rate PromQL query drops below 0.5%:
   ```promql
   sum(rate(messages_requests_failed_total{status_code=~"5.."}[5m])) / sum(rate(messages_requests_total[5m])) < 0.005
   ```
2. RabbitMQ `educk.communication.notifications` queue depth returns to 0.
3. Smoke test verification:
   ```bash
   curl -I -X POST http://localhost:8085/api/v1/messages -H "Content-Type: application/json" -d '{"test":true}'
   ```
   Must return `HTTP 201 Created` with valid `traceparent` header.
