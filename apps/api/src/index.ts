import app from './app';
import { loadConfig } from './utils/config';
import { logger } from '@shared/logger';

const cfg = loadConfig();
const port = cfg.server.port;

app.listen(port, () => {
  logger.info(`Memory Lane API listening on port ${port}`);
});
