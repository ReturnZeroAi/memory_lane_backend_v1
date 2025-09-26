import express from 'express';
import { securityMiddlewares } from './middleware/security';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';

const app = express();

app.use(express.json());
for (const mw of securityMiddlewares()) {
  app.use(mw as any);
}

app.use('/api', routes);
app.use(errorHandler);

export default app;
