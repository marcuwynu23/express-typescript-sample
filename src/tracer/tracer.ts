import '../config/config';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { NodeSDK } from '@opentelemetry/sdk-node';

const exporter = new OTLPTraceExporter({
  url: process.env.OPENTELEMETRY_URL || 'http://localhost:4317',
});

const sdk = new NodeSDK({
  serviceName: 'express-api',
  traceExporter: exporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': { enabled: false },
      '@opentelemetry/instrumentation-net': { enabled: false },
    }),
  ],
});

sdk.start();
