# Structured Log Contract - EduTrack Platform

## 1. Standard and Domain Schema Specification

| Field | Type | Requirement | Example | Description / Rationale |
|:---|:---|:---:|:---|:---|
| `timestamp` | string (ISO-8601 UTC) | Required | `2026-10-20T19:22:04.105Z` | Universal time alignment across distributed containers. |
| `level` | string (enum) | Required | `INFO` | Severity classification (`DEBUG`, `INFO`, `WARN`, `ERROR`). |
| `service` | string | Required | `educk-communication-api` | Identifies the originating microservice instance. |
| `version` | string | Required | `2.0.0` | Semantic version deployed to track regressions after rollouts. |
| `environment` | string | Required | `qa` | Runtime stage (`development`, `qa`, `production`). |
| `trace_id` | string (hex-32) | Required | `4bf92f3577b34da6a3ce929d0e0e4736` | W3C trace identifier linking all hops of a transaction. |
| `span_id` | string (hex-16) | Required | `5c84a86b3e77f012` | Specific execution segment within the service. |
| `correlation_id` | string | Required | `corr-msg-99120` | Client or gateway business tracking ID. |
| `event` | string | Required | `message.send.initiated` | Machine-indexable event dot-notation for Elasticsearch/Loki. |
| `message` | string | Required | `Processing parent message creation` | Human-readable diagnostic description. |
| `duration_ms` | number | Required | `42` | Execution latency of the local unit of work in milliseconds. |
| `sender_id` | string (UUID) | Required | `u-9081-parent-441` | EduTrack domain: authenticated sender user identifier. |
| `recipient_id` | string (UUID) | Required | `u-2201-teacher-102` | EduTrack domain: target teacher recipient identifier. |
| `student_id` | string (UUID) | Required | `s-4402-juan-chala` | EduTrack domain: student linking parent-teacher context. |
| `message_id` | string | Optional | `MSG-90124` | EduTrack domain: unique business ID of persisted message. |

---

## 2. Sensitive Data Policy (Never Log & Masking Rules)

| Data Category | Risk & Compliance | Masking / Redaction Policy | Example Before -> After |
|:---|:---|:---|:---|
| **Credentials & Hashes** | Security Compromise | Full suppression | `password123` -> `[REDACTED]` |
| **JWT Bearer Tokens** | Impersonation Risk | Token prefix only | `eyJhbGciOi...` -> `eyJh...[MASKED]` |
| **Message Body Content** | FERPA / Minor Privacy | Log metadata and byte count | `"My son is sick"` -> `body_bytes: 14` |
| **National IDs / Phones** | Personal PII Data | Masking to last 4 characters | `1075284910` -> `******4910` |

---

## 3. Seven Trace-Correlated JSON Log Samples (`trace_id`: 4bf92f3577b34da6a3ce929d0e0e4736)

```json
{"timestamp":"2026-10-20T19:22:01.010Z","level":"INFO","service":"educk-api-gateway","version":"2.0.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"00f067aa0ba902b7","correlation_id":"corr-msg-99120","event":"http.request.received","message":"Ingress request for message dispatch","duration_ms":2,"sender_id":"u-9081-parent-441","recipient_id":"u-2201-teacher-102","student_id":"s-4402-juan-chala","message_id":null}
{"timestamp":"2026-10-20T19:22:01.018Z","level":"INFO","service":"educk-api-gateway","version":"2.0.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"00f067aa0ba902b7","correlation_id":"corr-msg-99120","event":"http.request.routed","message":"Forwarding downstream to educk-communication-api","duration_ms":7,"sender_id":"u-9081-parent-441","recipient_id":"u-2201-teacher-102","student_id":"s-4402-juan-chala","message_id":null}
{"timestamp":"2026-10-20T19:22:01.045Z","level":"WARN","service":"educk-communication-api","version":"2.0.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"5c84a86b3e77f012","correlation_id":"corr-msg-99120","event":"business.rule.rejection","message":"Rejection: Sender lacks custodial relationship to student","duration_ms":24,"sender_id":"u-9081-parent-441","recipient_id":"u-2201-teacher-102","student_id":"s-4402-juan-chala","message_id":null}
{"timestamp":"2026-10-20T19:22:01.090Z","level":"INFO","service":"educk-communication-api","version":"2.0.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"5c84a86b3e77f012","correlation_id":"corr-msg-99120","event":"domain.validation.success","message":"Corrected relationship verified; initiating DB write","duration_ms":31,"sender_id":"u-9081-parent-441","recipient_id":"u-2201-teacher-102","student_id":"s-4402-juan-chala","message_id":null}
{"timestamp":"2026-10-20T19:22:04.102Z","level":"ERROR","service":"educk-communication-api","version":"2.0.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"a182f4bc39e10d54","correlation_id":"corr-msg-99120","event":"downstream.database.timeout","message":"Postgres educk-communication-db query timed out after 3000ms","duration_ms":3004,"sender_id":"u-9081-parent-441","recipient_id":"u-2201-teacher-102","student_id":"s-4402-juan-chala","message_id":null}
{"timestamp":"2026-10-20T19:22:04.148Z","level":"INFO","service":"educk-communication-api","version":"2.0.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"a182f4bc39e10d54","correlation_id":"corr-msg-99120","event":"database.insert.success","message":"Retry write succeeded on connection pool refresh","duration_ms":42,"sender_id":"u-9081-parent-441","recipient_id":"u-2201-teacher-102","student_id":"s-4402-juan-chala","message_id":"MSG-90124"}
{"timestamp":"2026-10-20T19:22:04.175Z","level":"INFO","service":"educk-communication-api","version":"2.0.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"3d91ca82bb4560ea","correlation_id":"corr-msg-99120","event":"amqp.event.published","message":"MessageSentEvent published to edutrack.events exchange","duration_ms":18,"sender_id":"u-9081-parent-441","recipient_id":"u-2201-teacher-102","student_id":"s-4402-juan-chala","message_id":"MSG-90124"}
```

---

## 4. Log Level Usage Criteria

- `ERROR`: System fault preventing request completion (e.g., PostgreSQL query timeout or RabbitMQ channel drop). Requires engineering action.
- `WARN`: Handled anomalies or business rule denials (e.g., parent trying to message teacher outside assigned classroom). System remains healthy.
- `INFO`: Significant lifecycle milestones (e.g., message successfully persisted, event published, token issued).
- `DEBUG`: Granular diagnostic payload details (e.g., query execution plan or AMQP routing topology bindings). Disabled in QA/Production.
