import test from 'node:test';
import assert from 'node:assert/strict';
import { parseTraceparent, formatTraceparent } from './trace.js';
import { traceContextMiddleware } from './middleware.js';
import { StructuredLogger } from './logger.js';
import { MetricsRegistry } from './metrics.js';
import { forwardDownstreamCall } from './downstream.js';

test('Observability - trace context extraction and downstream propagation', async (t) => {
  const incomingTraceId = '4bf92f3577b34da6a3ce929d0e0e4736';
  const incomingParentSpan = '00f067aa0ba902b7';
  const rawTraceparent = `00-${incomingTraceId}-${incomingParentSpan}-01`;

  const req = { headers: { 'traceparent': rawTraceparent } };
  const resHeaders = {};
  const res = {
    setHeader: (name, val) => { resHeaders[name.toLowerCase()] = val; }
  };

  traceContextMiddleware(req, res);

  assert.equal(req.traceCtx.traceId, incomingTraceId, 'Extracted traceId must match incoming');
  assert.equal(req.traceCtx.parentSpanId, incomingParentSpan, 'Parent span id must match');
  assert.ok(resHeaders['traceparent'], 'Response must include outgoing traceparent header');

  const downstreamCall = await forwardDownstreamCall(req.traceCtx, {
    messageId: 'MSG-90124',
    subject: 'Attendance notice'
  });

  const parsedDownstream = parseTraceparent(downstreamCall.headers['traceparent']);
  assert.equal(parsedDownstream.traceId, incomingTraceId, 'Downstream call must receive exact same trace_id');
});

test('Observability - structured logger output conforms to schema', () => {
  const logger = new StructuredLogger('educk-communication-api', '2.0.0', 'qa');
  const traceCtx = { traceId: '4bf92f3577b34da6a3ce929d0e0e4736', spanId: '5c84a86b3e77f012' };
  const entry = logger.info('message.created', 'Message successfully processed', traceCtx, {
    sender_id: 'u-parent-1',
    duration_ms: 15
  });

  assert.equal(entry.trace_id, traceCtx.traceId);
  assert.equal(entry.service, 'educk-communication-api');
  assert.equal(entry.duration_ms, 15);
});

test('Observability - metrics registry exposes Prometheus counter and histogram', () => {
  const metrics = new MetricsRegistry();
  metrics.incRequest('success');
  metrics.observeDuration(0.042);

  const output = metrics.formatPrometheus();
  assert.match(output, /messages_requests_total\{outcome="success"\} 1/);
  assert.match(output, /message_duration_seconds_bucket\{le="0.05"\} 1/);
  assert.match(output, /message_duration_seconds_count 1/);
});
