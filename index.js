import { startBackups } from './src/backups.js';
import logger from './src/class/Logger.js';

import cron from 'node-cron';

async function run() {
  logger.log(`----- Starting backups -----`);
  await startBackups(null, true);
  logger.log(`----- Backups completed -----`);
}

cron.schedule('0 3 * * *', run);

// Wait 1 second to spin up environment
await new Promise((resolve) => setTimeout(resolve, 1000));

await run();
