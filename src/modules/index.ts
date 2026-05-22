import type { Application } from 'express';
import { implementHTTP } from './http';
import { implementObservability } from './observability';
import { implementAPIDocumentation } from './scalar/scalar';

const modules: Record<string, (app: Application) => void> = {
  observability: implementObservability,
  'api-documentation': implementAPIDocumentation,
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
