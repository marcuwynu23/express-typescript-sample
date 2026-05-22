import { type Application, Router } from 'express';
import { itemRoutes } from '../features/item/item.routes';
import { initRouterConfiguration } from './initial.http';

function createRouter() {
  const router = Router();
  initRouterConfiguration(router);
  return router;
}

export function implementHTTP(app: Application) {
  const router = createRouter();
  // CRUD routes
  router.use('/api/items', itemRoutes);

  app.use(router);
}
