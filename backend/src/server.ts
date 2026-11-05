import app from './app';
import { connectDB, disconnectDB } from './config/db';
import { env } from './config/env';
import { logger } from './config/logger';

const start = async () => {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  const shutdown = (signal: string) => {
    logger.info(`${signal} received, shutting down`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('unhandledRejection', (reason) => {
    logger.error(reason instanceof Error ? reason : String(reason));
    shutdown('unhandledRejection');
  });
};

start().catch((err) => {
  logger.error(err);
  process.exit(1);
});
