import { startBackups } from './src/backups.js';
import logger from './src/class/Logger.js';

import cron from 'node-cron';

async function run() {
  logger.log(`----- Starting backups -----`);
  await startBackups(null, true);
  logger.log(`----- Backups completed -----`);
}

await run();

cron.schedule('0 3 * * *', run);
