import { parseTraceparent, formatTraceparent } from './trace.js';

export function traceContextMiddleware(req, res, next) {
  const incomingHeader = req.headers['traceparent'];
  const traceCtx = parseTraceparent(incomingHeader);
  req.traceCtx = traceCtx;
  res.setHeader('traceparent', formatTraceparent(traceCtx));
  if (typeof next === 'function') {
    next();
  }
}
