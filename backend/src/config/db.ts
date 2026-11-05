import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

export const connectDB = async (): Promise<void> => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.MONGO_URI);
  logger.info('MongoDB connected');
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.connection.close();
};