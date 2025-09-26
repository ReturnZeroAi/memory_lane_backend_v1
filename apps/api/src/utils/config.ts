import fs from 'fs';
import path from 'path';
import { z } from 'zod';

const env = (process.env.NODE_ENV || 'development').toLowerCase();
const configPath = path.join(process.cwd(), 'config', env, `${env}.json`);

const SecuritySchema = z.object({
  jwtAccessSecret: z.string().min(10),
  jwtRefreshSecret: z.string().min(10),
  accessTokenTtlSec: z.number().int().positive(),
  refreshTokenTtlSec: z.number().int().positive(),
  bcryptSaltRounds: z.number().int().positive(),
  rateLimitWindowMs: z.number().int().positive(),
  rateLimitMax: z.number().int().positive()
});

const ConfigSchema = z.object({
  server: z.object({ port: z.number().int().positive() }),
  security: SecuritySchema,
  database: z.object({ url: z.string().min(1) }),
  cors: z.object({
    origin: z.array(z.string()),
    credentials: z.boolean()
  })
});

export type AppConfig = z.infer<typeof ConfigSchema>;

export function loadConfig(): AppConfig {
  const raw = fs.readFileSync(configPath, 'utf8');
  const json = JSON.parse(raw);
  return ConfigSchema.parse(json);
}
