# Service Level Objectives (SLOs) and Error Budget - EduTrack Platform

## 1. SLO Definitions for Critical Journey (`educk-communication-api`)

| Objective Name | SLI Metric & Ratio | PromQL Query (30-day Rolling Window) | Target | Window |
|:---|:---|:---|:---:|:---:|
| **Availability SLO** | Proportion of successful requests (non-5xx) over valid requests to `POST /api/v1/messages`. | `sum(rate(messages_requests_total{status_code!~"5.."}[30d])) / sum(rate(messages_requests_total[30d]))` | **99.5%** | 30 days (rolling) |
| **Latency SLO** | Proportion of successful message dispatches completed in <= 500ms. | `sum(rate(messages_request_duration_seconds_bucket{le="0.5"}[30d])) / sum(rate(messages_requests_total{status_code="201"}[30d]))` | **95.0%** | 30 days (rolling) |
| **Event Delivery SLO** | Proportion of persisted messages published to RabbitMQ exchange within 1 second. | `sum(rate(messages_amqp_published_total[30d])) / sum(rate(messages_persisted_total[30d]))` | **99.9%** | 30 days (rolling) |

---

## 2. Traffic Estimation and Error Budget Calculations

- **Population & User Base:** EduTrack serves 1,200 enrolled students, 2,400 guardians/parents, and 85 institutional educators across preschool, primary, and secondary school grades.
- **Daily Traffic Profile:** Parents and teachers interact predominantly during two core communication windows: morning check-in (07:00-08:30) and afternoon academic follow-up (14:00-16:30).
- **Average Daily Volume:** 10,000 message submissions, queries, and notification dispatches per school day.
- **Monthly Volume (30 days):** 10,000 * 30 = 300,000 valid requests.

### Mathematical Budget Breakdown:
1. **Availability Budget (99.5% SLO):**
   - Allowed failure margin: 100% - 99.5% = 0.5%.
   - **Request Budget:** 300,000 * 0.005 = **1,500 allowed failed requests** per 30-day window.
   - **Downtime Minutes:** 30 days * 24 h * 60 min = 43,200 minutes.
   - 43,200 * 0.005 = **216 minutes (3 hours 36 minutes)** of permissible total outage.

2. **Latency Budget (95.0% <= 500ms SLO):**
   - Allowed degraded margin: 100% - 95.0% = 5.0%.
   - **Request Budget:** 300,000 * 0.05 = **15,000 slow requests** permissible before breaching the SLO.

---

## 3. Team Error Budget Policy

- **50% Consumed (Warning Threshold):**
  - Automated notification emitted to Slack/Teams `#edutrack-alerts`.
  - Tech Lead and QA audit recent deployments, slow query traces, and PostgreSQL connection pool saturation.
  - Non-essential background batch jobs re-scheduled outside school peak hours.

- **75% Consumed (Degradation / Freeze Alert):**
  - Feature release freeze enacted for `educk-communication-api`.
  - Current sprint roadmap shifts to reliability engineering: database query optimization and AMQP publisher-confirms hardening.
  - Deployment gate requires explicit sign-off from Technical Lead.

- **100% Consumed (Full Freeze & Incident Review):**
  - Total production deployment freeze (except critical P0 CVE security patches).
  - Mandatory blameless postmortem meeting conducted within 48 hours.
  - On-call escalation rules tightened until 30-day rolling availability recovers above 99.5%.
