import type { Application } from 'express';
import mongoose from 'mongoose';
import { config } from '../../config/config';

export async function connectDatabase(): Promise<typeof mongoose> {
  const connection = await mongoose.connect(config.mongoUri);
  console.log(`MongoDB connected: ${connection.connection.host}`);
  return connection;
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  console.log('MongoDB disconnected');
}

export function implementDatabase(_app: Application) {
  if (config.isTest) return;

  connectDatabase().catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
}
