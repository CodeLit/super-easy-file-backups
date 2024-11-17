import fs from 'fs-extra';
import path from 'path';
import FolderBackup from './class/FolderBackup.js';
import logger from './class/Logger.js';
import zlib from 'zlib';

const jsonConfigName = 'backups-config.json';
const projectsPath = path.resolve('projects');
const backupsPath = path.resolve('backups');

/**
 * A function to handle a backup operation.
 *
 * @param {object} backupJson - The backup JSON data.
 * @param {string} projectPath - The path to the project.
 * @param {Date} [rewriteDate=undefined] - The date to rewrite.
 */
async function handeBackup(backupJson, projectPath, rewriteDate = undefined) {
  if (!backupJson.type) throw new Error('Missing backup type option.');
  if (backupJson.type === 'mega-storage') {
    if (!backupJson.email || !backupJson.password)
      throw new Error('Missing Mega credentials.');
    if (!backupJson.backups_path)
      throw new Error('Missing Mega backups destination path.');
  }

  const backup = new FolderBackup({
    type: backupJson.type,
    email: backupJson.email,
    password: backupJson.password,
    fromFolder: projectPath,
    pathToBackups:
      backupJson.type === 'mega-storage'
        ? backupJson.backups_path
        : path.normalize(`${backupsPath}/${path.basename(projectPath)}`),
  });

  // Initialize file system
  await backup.init();
  if (rewriteDate) backup.today = new Date(rewriteDate);
  else backup.today = new Date();

  logger.log('Current date is ' + backup.today.toDateString());

  // https://www.npmjs.com/package/maximatch
  backup.filter = backupJson.filter || [];

  if (backupJson.filter_commonly_ignored_folders !== false) {
    backup.filter = [
      ...backup.filter,
      ...['**/vendor/**', '**/node_modules/**', '.git/**', '**/__pycache__/**'],
    ];
  }

  if (backupJson.filter_gitignored === true) {
    try {
      const gitignoreRules = fs
        .readFileSync(path.normalize(`${projectPath}/.gitignore`), 'utf8')
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line !== '' && !line.startsWith('#'));
      backup.filter = [...backup.filter, ...gitignoreRules];
    } catch (err) {
      console.error(`Error reading ${projectPath}/.gitignore: ${err.message}`);
    }
  }

  const compressionMap = {
    none: zlib.constants.Z_NO_COMPRESSION,
    default: zlib.constants.Z_DEFAULT_COMPRESSION,
    fast: zlib.constants.Z_BEST_SPEED,
    best: zlib.constants.Z_BEST_COMPRESSION,
  };

  if (backupJson.compression_level) {
    backup.compressionLevel =
      compressionMap[backupJson.compressionLevel] ||
      zlib.constants.Z_DEFAULT_COMPRESSION;
  }

  if (backupJson.copies.daily)
    await backup.makeBackups(backupJson.copies.daily, 'daily');
  if (backupJson.copies.weekly)
    await backup.makeBackups(backupJson.copies.weekly, 'weekly');
  if (backupJson.copies.monthly)
    await backup.makeBackups(backupJson.copies.monthly, 'monthly');
  if (backupJson.copies.annually)
    await backup.makeBackups(backupJson.copies.annually, 'annually');
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

      if (!fs.lstatSync(folderPath).isDirectory()) {
        continue;
      }

      if (!fs.existsSync(configPath)) {
        logger.log(
          `--- Backup skipped for ${folder} because of missing config file.`,
        );
        continue;
      }

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
    }
  } catch (e) {
    logger.error(e.stack);
  }
}

export { startBackups, handeBackup, backupsPath, projectsPath };
