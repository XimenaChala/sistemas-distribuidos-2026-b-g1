# Golden Signals and Metric Catalog - EduTrack Platform

## 1. Golden Signals Specification (`educk-communication-api`)

| Signal | Metric Name | Type | Labels | PromQL Query (Dashboard / Alerting) |
|:---|:---|:---:|:---|:---|
| **Latency** | `messages_request_duration_seconds` | Histogram | `route`, `method`, `status_code` | `histogram_quantile(0.95, sum by (le) (rate(messages_request_duration_seconds_bucket[5m])))` |
| **Traffic** | `messages_requests_total` | Counter | `route`, `method` | `sum(rate(messages_requests_total[5m]))` |
| **Errors** | `messages_requests_failed_total` | Counter | `route`, `error_type`, `status_code` | `sum(rate(messages_requests_failed_total{status_code=~"5.."}[5m])) / sum(rate(messages_requests_total[5m]))` |
| **Saturation** | `messages_connection_pool_active_ratio` | Gauge | `pool_id`, `state` | `sum(messages_connection_pool_active) / sum(messages_connection_pool_max)` |

---

## 2. Cardinality Analysis and Anti-Pattern Guardrails

| Unbounded Label (Forbidden) | Cardinality Risk | Bounded Replacement Label | Max Expected Cardinality |
|:---|:---|:---|:---:|
| `user_id` / `sender_id` | Millions of parents/teachers -> OOM crash | `user_role` (`PARENT`, `TEACHER`, `ADMIN`) | 3 |
| Raw URL (`/api/v1/messages/MSG-90124`) | Unbounded path parameters | Normalized `route` (`/api/v1/messages/{id}`) | 8 distinct routes |
| Email / Phone / Student ID | High cardinality & PII violation | Replaced by `channel_type` (`WEB`, `EMAIL_NOTIFICATION`) | 2 |
| Error Message String | Arbitrary stack trace messages | Categorized `error_type` (`VALIDATION`, `DB_TIMEOUT`, `AMQP_UNAVAILABLE`) | 6 |

---

## 3. Latency Histogram Buckets and Justification

- **Chosen Buckets (seconds):** `[0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0]`
- **User Experience Justification:**
  - `0.05s - 0.25s (50ms - 250ms)`: Immediate interactive UI feedback expected by teachers and parents sending messages during school peak hours.
  - `0.5s (500ms)`: Acceptable p95 target for message validation, relationship check, and database insertion.
  - `1.0s (1000ms)`: Upper acceptable limit before perceived interface sluggishness.
  - `2.5s - 5.0s`: Degradation threshold warning; captures database connection pool starvation or broker backpressure before client timeout at 5000ms.
