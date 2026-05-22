import type { Application } from 'express';
import express from 'express';

export function implementFeatures(app: Application) {
  // Parse JSON request bodies for CRUD operations
  app.use(express.json());
}
