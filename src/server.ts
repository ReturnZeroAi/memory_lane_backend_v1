import { app } from './app.js';
import { config } from './libs/shared/config/index.js';
import { logger } from './libs/shared/logger/index.js';
import { disconnectDb } from './libs/shared/db/index.js';

const server = app.listen(config.port, () => {
  logger.info(
    { port: config.port, env: config.nodeEnv },
    `🚀 Server running on http://localhost:${config.port}`,
  );
});

// ─── Graceful Shutdown ───────────────────────────────────────────────
const gracefulShutdown = async (signal: string): Promise<void> => {
  logger.info({ signal }, 'Received shutdown signal, closing gracefully...');

  server.close(async () => {
    logger.info('HTTP server closed');

    try {
      await disconnectDb();
      logger.info('Database connection closed');
    } catch (error) {
      logger.error({ error }, 'Error closing database connection');
    }

    process.exit(0);
  });

  // Force shutdown after 10s
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10_000);
};

process.on('SIGTERM', () => { void gracefulShutdown('SIGTERM'); });
process.on('SIGINT', () => { void gracefulShutdown('SIGINT'); });

process.on('unhandledRejection', (reason: unknown) => {
  logger.fatal({ reason }, 'Unhandled Promise Rejection');
  throw reason;
});

process.on('uncaughtException', (error: Error) => {
  logger.fatal({ error }, 'Uncaught Exception — shutting down');
  process.exit(1);
});
