import { BatchSpanProcessor, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { api, NodeSDK } from '@opentelemetry/sdk-node';
import * as process from 'process';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import * as dotenv from 'dotenv';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';
import { SequelizeInstrumentation } from 'opentelemetry-instrumentation-sequelize';
//const { AwsInstrumentation } = require("@opentelemetry/instrumentation-aws-sdk");
import { B3Propagator } from '@opentelemetry/propagator-b3';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
//import { SocketIoInstrumentation } from '@opentelemetry/instrumentation-socket.io';
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';

dotenv.config();

const jaegerExporter = new JaegerExporter({
  endpoint: 'http://localhost:14268/api/traces',
});

const oltpExporter = new OTLPTraceExporter({
  url: 'http://api.honeycomb.io/v1/traces',
  headers: {
    'x-honeycomb-team': process.env.HONEYCOMB_KEY,
  },
});

const traceExporter = process.env.NODE_ENV === 'development' ? jaegerExporter : oltpExporter;

//batch span processor is used to batch multiple spans together and send them as a single batch
//in production, instead of the spans being traced one by one, process them in batches
const spanProcessor = process.env.NODE_ENV === 'development' ? new SimpleSpanProcessor(traceExporter) : new BatchSpanProcessor(traceExporter);

api.propagation.setGlobalPropagator(new B3Propagator());

const instrumentations = [
  new HttpInstrumentation(),
  new ExpressInstrumentation(),
  new NestInstrumentation(),
  new PgInstrumentation(),
  new SequelizeInstrumentation(),
  //new SocketIoInstrumentation(),
  new WinstonInstrumentation(),
  //new AwsInstrumentation({
  //github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/node/opentelemetry-instrumentation-aws-sdk
  //}),
];
//sdk is the core component of the opentelemetry library that manages the trace creation, propagation and processing
//the reason why we use sdk instead of just package is that sdk provides a comprehensive framework for tracing
export const otelSDK = new NodeSDK({
  //resource is an entity that represents the entity producing telemetry data
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.OTEL_SERVICE_NAME,
  }),
  //spanProcessor,
  instrumentations,
});

process.on('SIGTERM', () => {
  otelSDK
    .shutdown()
    .then(
      () => console.log('SDK shut down successfully'),
      err => console.log('Error shutting down SDK', err),
    )
    .finally(() => process.exit(0));
});
