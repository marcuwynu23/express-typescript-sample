import type { Application } from 'express';
import { implementDatabase } from './database';
import { implementFeatures } from './features';
import { implementHTTP } from './http';
import { implementObservability } from './observability';
import { implementAPIDocumentation } from './scalar/scalar';

const modules: Record<string, (app: Application) => void> = {
  observability: implementObservability,
  database: implementDatabase,
  'api-documentation': implementAPIDocumentation,
  features: implementFeatures,
  http: implementHTTP,
};

export function useModule(app: Application, name: string) {
  const init = modules[name];
  if (!init) {
    throw new Error(`Unknown module: "${name}". Available: ${Object.keys(modules).join(', ')}`);
  }
  init(app);
}

export function useAllModules(app: Application) {
  for (const init of Object.values(modules)) {
    init(app);
  }
}
