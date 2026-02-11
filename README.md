# Production-Grade Node.js Backend — Setup Guide

## Requirements
- Node.js v20+
- PostgreSQL v14+
- npm

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```
   *Ensure you have a running PostgreSQL instance and update `DATABASE_URL`.*

3. **Database Migration**
   Apply the Prisma schema to your database:
   ```bash
   npx prisma migrate dev --name init
   ```
   *This will also generate the Prisma Client.*

4. **Build & Run**
   Development mode:
   ```bash
   npm run dev
   ```

   Production build:
   ```bash
   npm run build
   npm start
   ```

## API Documentation

- **Base URL**: `http://localhost:3000/api/v1`

| Module | Method | Endpoint | Description |
|---|---|---|---|
| **Auth** | POST | `/auth/register` | Register new user |
| | POST | `/auth/login` | Login & get JWT |
| **Lanes** | GET | `/lanes` | List all lanes |
| | POST | `/lanes` | Create a lane |
| **Notes** | GET | `/notes?page=1&limit=10` | List notes (paginated) |
| | POST | `/notes` | Create a note |
| **Calendars** | GET | `/calendars` | List calendar events |
| | POST | `/calendars` | Create event |

## Architecture Overview

- **`src/app.ts`**: Express app setup, middleware, and routes.
- **`src/server.ts`**: HTTP server entry point.
- **`src/apps/`**: Feature modules (Auth, Lanes, Calendars, Notes).
- **`src/libs/shared/`**: Shared utilities (Config, DB, Logger, Response, Errors, Middleware).
- **`prisma.config.ts`**: Prisma 7 configuration file.

## Testing

Run TypeScript strict compilation check:
```bash
npm run typecheck
```
