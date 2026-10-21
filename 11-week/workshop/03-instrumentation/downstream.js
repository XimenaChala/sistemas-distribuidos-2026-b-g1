import { formatTraceparent } from './trace.js';

export async function forwardDownstreamCall(traceCtx, payload, targetTransport = 'amqp') {
  const downstreamHeaders = {
    'traceparent': formatTraceparent(traceCtx),
    'x-correlation-id': traceCtx.correlationId || 'corr-educk-auto'
  };

  const outboundSpan = {
    targetTransport,
    traceId: traceCtx.traceId,
    parentSpanId: traceCtx.spanId,
    headers: downstreamHeaders,
    dispatchedPayload: payload,
    deliveredAt: new Date().toISOString()
  };

  return outboundSpan;
}
