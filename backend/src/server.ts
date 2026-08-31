import './config/env.config'; // Load env first
import { validateEnv } from './config/env.config';
import app from './app';
import { connectDatabase } from './config/database.config';
import { logger } from './common/utils/logger';
import { env } from './config/env.config';

async function bootstrap(): Promise<void> {
  // Fail fast if required environment variables are missing
  validateEnv();

  try {
    // Connect to MongoDB
    await connectDatabase();

    // Start HTTP server
    const server = app.listen(env.node.port, () => {
      logger.info(
        `🚀 Server running in ${env.node.env} mode on port ${env.node.port}`,
      );
      logger.info(`📍 API: http://localhost:${env.node.port}/api/v1`);
    });

    // Graceful shutdown
    const shutdown = (signal: string): void => {
      logger.info(`${signal} received — shutting down gracefully`);
      server.close(async () => {
        const { disconnectDatabase } = await import('./config/database.config');
        await disconnectDatabase();
        logger.info('Process terminated');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Rejection:', reason);
      shutdown('UNHANDLED_REJECTION');
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
