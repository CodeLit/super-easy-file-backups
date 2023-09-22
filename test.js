import { backupsPath, projectsPath, startBackups } from './src/backups.js';
import path from 'path';
import FolderBackup from './src/class/FolderBackup.js';
import {
  ensureToClearFolder,
  folderIsNotEmpty,
  structureMatch,
} from './src/class/Asserts.js';

// Wait 1 second to spin up environment
await new Promise((resolve) => setTimeout(resolve, 1000));

const synchronously = true;

const singleProjectPath = path.normalize(projectsPath + '/single-project');
const testProjectPath = path.normalize(projectsPath + '/test-project');
const singleProjectBackupsPath = path.normalize(
  backupsPath + '/single-project',
);
const testBackupsPath = path.normalize(backupsPath + '/test-project');
const todayDate = FolderBackup.formatISODate(new Date());
const todayArchive = 'bkp_' + todayDate + '.tgz';

folderIsNotEmpty(singleProjectPath);
folderIsNotEmpty(testProjectPath);

ensureToClearFolder(singleProjectBackupsPath);
ensureToClearFolder(testBackupsPath);

// There was a backup long time ago...
await startBackups('2019-01-01', synchronously);

structureMatch(
  [singleProjectBackupsPath, testBackupsPath],
  [
    'daily/bkp_2019-01-01.tgz',
    'weekly/bkp_2019-01-01.tgz',
    'monthly/bkp_2019-01-01.tgz',
    'annually/bkp_2019-01-01.tgz',
  ],
);

ensureToClearFolder(singleProjectBackupsPath);
ensureToClearFolder(testBackupsPath);

await startBackups('2020-06-21', synchronously);

structureMatch(
  [singleProjectBackupsPath, testBackupsPath],
  [
    'daily/bkp_2020-06-21.tgz',
    'weekly/bkp_2020-06-21.tgz',
    'monthly/bkp_2020-06-21.tgz',
    'annually/bkp_2020-06-21.tgz',
  ],
);

// And another backup next day after first
await startBackups('2020-06-22', synchronously);

structureMatch(singleProjectBackupsPath, [
  'daily/bkp_2020-06-22.tgz',
  'weekly/bkp_2020-06-21.tgz',
  'monthly/bkp_2020-06-21.tgz',
  'annually/bkp_2020-06-21.tgz',
]);

structureMatch(testBackupsPath, [
  'daily/bkp_2020-06-21.tgz',
  'daily/bkp_2020-06-22.tgz',
  'weekly/bkp_2020-06-21.tgz',
  'monthly/bkp_2020-06-21.tgz',
  'annually/bkp_2020-06-21.tgz',
]);

await startBackups('2021-06-23', synchronously);

structureMatch(singleProjectBackupsPath, [
  'daily/bkp_2021-06-23.tgz',
  'weekly/bkp_2021-06-23.tgz',
  'monthly/bkp_2021-06-23.tgz',
  'annually/bkp_2021-06-23.tgz',
]);

structureMatch(testBackupsPath, [
  'daily/bkp_2020-06-21.tgz',
  'daily/bkp_2020-06-22.tgz',
  'daily/bkp_2021-06-23.tgz',
  'weekly/bkp_2020-06-21.tgz',
  'weekly/bkp_2021-06-23.tgz',
  'monthly/bkp_2020-06-21.tgz',
  'monthly/bkp_2021-06-23.tgz',
  'annually/bkp_2020-06-21.tgz',
  'annually/bkp_2021-06-23.tgz',
]);

await startBackups('2021-08-24', synchronously);

structureMatch(singleProjectBackupsPath, [
  'daily/bkp_2021-08-24.tgz',
  'weekly/bkp_2021-08-24.tgz',
  'monthly/bkp_2021-08-24.tgz',
  'annually/bkp_2021-06-23.tgz',
]);

structureMatch(testBackupsPath, [
  'daily/bkp_2020-06-21.tgz',
  'daily/bkp_2020-06-22.tgz',
  'daily/bkp_2021-06-23.tgz',
  'daily/bkp_2021-08-24.tgz',
  'weekly/bkp_2020-06-21.tgz',
  'weekly/bkp_2021-06-23.tgz',
  'weekly/bkp_2021-08-24.tgz',
  'monthly/bkp_2020-06-21.tgz',
  'monthly/bkp_2021-06-23.tgz',
  'monthly/bkp_2021-08-24.tgz',
  'annually/bkp_2021-06-23.tgz',
  'annually/bkp_2021-08-24.tgz',
]);

// Current TODAY will rewrite the old backups
await startBackups(null, synchronously);

structureMatch(singleProjectBackupsPath, [
  'daily/' + todayArchive,
  'weekly/' + todayArchive,
  'monthly/' + todayArchive,
  'annually/' + todayArchive,
]);

structureMatch(testBackupsPath, [
  'daily/bkp_2020-06-22.tgz',
  'daily/bkp_2021-06-23.tgz',
  'daily/bkp_2021-08-24.tgz',
  'daily/' + todayArchive,
  'weekly/bkp_2020-06-21.tgz',
  'weekly/bkp_2021-06-23.tgz',
  'weekly/bkp_2021-08-24.tgz',
  'weekly/' + todayArchive,
  'monthly/bkp_2021-06-23.tgz',
  'monthly/bkp_2021-08-24.tgz',
  'monthly/' + todayArchive,
  'annually/bkp_2021-08-24.tgz',
  'annually/' + todayArchive,
]);

console.log('\x1b[32m--- All test is successfully completed! ---\x1b[0m');
