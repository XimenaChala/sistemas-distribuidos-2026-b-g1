export class StructuredLogger {
  constructor(serviceName = 'educk-communication-api', version = '2.0.0', env = 'qa') {
    this.service = serviceName;
    this.version = version;
    this.env = env;
  }

  log(level, event, message, ctx = {}, domain = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      service: this.service,
      version: this.version,
      environment: this.env,
      trace_id: ctx.traceId || null,
      span_id: ctx.spanId || null,
      correlation_id: ctx.correlationId || domain.correlation_id || null,
      event,
      message,
      duration_ms: domain.duration_ms ?? 0,
      sender_id: domain.sender_id || null,
      recipient_id: domain.recipient_id || null,
      student_id: domain.student_id || null,
      message_id: domain.message_id || null
    };
    const jsonString = JSON.stringify(entry);
    if (level === 'ERROR') {
      console.error(jsonString);
    } else {
      console.log(jsonString);
    }
    return entry;
  }

  info(event, message, ctx, domain) { return this.log('INFO', event, message, ctx, domain); }
  warn(event, message, ctx, domain) { return this.log('WARN', event, message, ctx, domain); }
  error(event, message, ctx, domain) { return this.log('ERROR', event, message, ctx, domain); }
}
