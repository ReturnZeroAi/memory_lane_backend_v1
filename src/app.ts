import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './libs/shared/config/index.js';
import { rateLimiter, requestLogger, errorHandler } from './libs/shared/middleware/index.js';
import { authRoutes } from './apps/auth/routes.js';
import { lanesRoutes } from './apps/lanes/routes.js';
import { calendarsRoutes } from './apps/calendars/routes.js';
import { notesRoutes } from './apps/notes/routes.js';
import { ApiResponse } from './libs/shared/response/index.js';

const app = express();

// ─── Security ────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Body Parsing ────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Rate Limiting ───────────────────────────────────────────────────
app.use(rateLimiter);

// ─── Request Logging ─────────────────────────────────────────────────
app.use(requestLogger);

// ─── Health Check ────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  ApiResponse.success(res, {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ─── API Routes ──────────────────────────────────────────────────────
const API_PREFIX = '/api/v1';

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/lanes`, lanesRoutes);
app.use(`${API_PREFIX}/calendars`, calendarsRoutes);
app.use(`${API_PREFIX}/notes`, notesRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────
app.use((_req, res) => {
  ApiResponse.error(res, 'Route not found', 404);
});

// ─── Global Error Handler ────────────────────────────────────────────
app.use(errorHandler);

export { app };
