import fs from 'fs-extra';
import path from 'path';
import FolderBackup from './class/FolderBackup.js';
import logger from './class/Logger.js';

const jsonConfigName = 'backups-config.json';
const projectsPath = path.resolve('projects');
const backupsPath = path.resolve('backups');

/**
 * A function to handle a backup operation.
 *
 * @param {object} backupJsonData - The backup JSON data.
 * @param {string} projectPath - The path to the project.
 * @param {Date} [rewriteDate=undefined] - The date to rewrite.
 */
async function handeBackup(
  backupJsonData,
  projectPath,
  rewriteDate = undefined,
) {
  const backup = new FolderBackup({
    type: backupJsonData.type,
    'from-folder': projectPath,
    'path-to-backups': path.normalize(
      `${backupsPath}/${path.basename(projectPath)}`,
    ),
    'no-info-messages': false, // Disabling info messages from console.info
  });

  // Initialize file system
  await backup.init();
  if (rewriteDate) backup.today = new Date(rewriteDate);
  else backup.today = new Date();

  logger.log('Current date is ' + backup.today.toDateString());

  // https://www.npmjs.com/package/maximatch
  backup.filter = backupJsonData.filter || [];
  if (backupJsonData.copies.daily)
    await backup.daily(backupJsonData.copies.daily);
  if (backupJsonData.copies.weekly)
    await backup.weekly(backupJsonData.copies.weekly);
  if (backupJsonData.copies.monthly)
    await backup.monthly(backupJsonData.copies.monthly);
  if (backupJsonData.copies.annually)
    await backup.annually(backupJsonData.copies.annually);
  await backup.closeConnection();
}

/**
 * Asynchronously starts backups for all projects in a given directory.
 *
 * @param {undefined} rewriteDate - The date to rewrite the backups to. Defaults to undefined.
 * @param {boolean} synchronously - Whether to execute the backups synchronously or not. Defaults to true.
 * @return {undefined} - Does not return a value.
 */
async function startBackups(rewriteDate = undefined, synchronously = false) {
  try {
    const directory = fs.readdirSync(projectsPath);
    for (const folder of directory) {
      const folderPath = path.normalize(`${projectsPath}/${folder}`);
      const configPath = path.normalize(`${folderPath}/${jsonConfigName}`);
      if (fs.lstatSync(folderPath).isDirectory() && fs.existsSync(configPath)) {
        const data = fs.readFileSync(configPath, 'utf8');
        const jsonData = JSON.parse(data);
        logger.log(`--- Backup started for ${folder}`);
        if (synchronously) {
          await handeBackup(jsonData, folderPath, rewriteDate);
          logger.log(`--- Backup completed for ${folder}`);
        } else {
          handeBackup(jsonData, folderPath, rewriteDate).then(() => {
            logger.log(`--- Backup completed for ${folder}`);
          });
        }
      } else {
        logger.log(`--- Backup skipped for ${folder}`);
      }
    }
  } catch (e) {
    logger.error(e);
  }
}

export { startBackups, handeBackup, backupsPath };
