import './config/config';
import './modules/observability/tracer';
import express from 'express';
import { useModule } from './modules';

const app = express();
useModule(app, 'observability');
useModule(app, 'api-documentation');
useModule(app, 'http');

export { app };
