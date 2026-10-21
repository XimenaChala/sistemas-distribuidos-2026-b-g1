import crypto from 'node:crypto';

export function newTraceContext() {
  return {
    version: '00',
    traceId: crypto.randomBytes(16).toString('hex'),
    spanId: crypto.randomBytes(8).toString('hex'),
    traceFlags: '01'
  };
}

export function parseTraceparent(header) {
  if (!header || typeof header !== 'string') return newTraceContext();
  const parts = header.trim().split('-');
  if (parts.length !== 4 || parts[0] !== '00') return newTraceContext();
  const [version, traceId, parentSpanId, traceFlags] = parts;
  if (traceId.length !== 32 || parentSpanId.length !== 16) return newTraceContext();
  return {
    version,
    traceId,
    spanId: crypto.randomBytes(8).toString('hex'),
    parentSpanId,
    traceFlags
  };
}

export function formatTraceparent(ctx) {
  return `${ctx.version || '00'}-${ctx.traceId}-${ctx.spanId}-${ctx.traceFlags || '01'}`;
}
