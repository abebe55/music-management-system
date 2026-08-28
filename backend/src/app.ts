import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { corsConfig } from './config/cors.config';
import { securityMiddleware } from './common/middleware/security.middleware';
import { globalRateLimit } from './common/middleware/rate-limit.middleware';
import { requestLogger } from './common/middleware/request-logger.middleware';
import { errorHandler } from './common/middleware/error-handler.middleware';
import { notFoundHandler } from './common/middleware/not-found.middleware';
import apiRouter from './routes/index';

const app = express();

// Security headers
app.use(securityMiddleware);

// CORS
app.use(cors(corsConfig));
app.options('*', cors(corsConfig));

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Request logging
app.use(requestLogger);

// Global rate limiting
app.use(globalRateLimit);

// API routes
app.use('/api/v1', apiRouter);

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
