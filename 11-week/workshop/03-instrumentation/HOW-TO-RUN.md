# How To Run Instrumentation and Verification Tests

## Prerequisites
- Node.js (v20+ or v22+ LTS). Zero external dependencies.

## Commands
```bash
cd 11-week/workshop/03-instrumentation
node --test test.js
```

## Console Execution Output
```text
TAP version 13
{"timestamp":"2026-10-21T00:00:19.460Z","level":"INFO","service":"educk-communication-api","version":"2.0.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"5c84a86b3e77f012","correlation_id":null,"event":"message.created","message":"Message successfully processed","duration_ms":15,"sender_id":"u-parent-1","recipient_id":null,"student_id":null,"message_id":null}
# Subtest: Observability - trace context extraction and downstream propagation
ok 1 - Observability - trace context extraction and downstream propagation
# Subtest: Observability - structured logger output conforms to schema
ok 2 - Observability - structured logger output conforms to schema
# Subtest: Observability - metrics registry exposes Prometheus counter and histogram
ok 3 - Observability - metrics registry exposes Prometheus counter and histogram
1..3
# tests 3 | pass 3 | fail 0
```
