import { backupsPath, projectsPath, startBackups } from './src/backups.js';
import path from 'path';
import FolderBackup from './src/class/FolderBackup.js';
import {
  fileExists,
  filesLength,
  folderIsNotEmpty,
} from './src/class/Asserts.js';

const synchronously = true;

const someProjectPath = path.normalize(projectsPath + '/some-project2');
const testProjectPath = path.normalize(projectsPath + '/test-project');

folderIsNotEmpty(someProjectPath);
folderIsNotEmpty(testProjectPath);

// There was a backup long time ago...
await startBackups('2020-06-21', synchronously);

// And another backup next day after first
await startBackups('2020-06-22', synchronously);
await startBackups('2021-06-23', synchronously);
await startBackups('2021-08-24', synchronously);

// Current TODAY will rewrite the old backups
await startBackups(null, synchronously);

console.log('\x1b[32m--- Backups are created! ---\x1b[0m');

folderIsNotEmpty(someProjectPath);
folderIsNotEmpty(testProjectPath);

const someProjectBackupPath = path.normalize(backupsPath + '/some-project2');

folderIsNotEmpty(someProjectBackupPath);

filesLength(path.normalize(someProjectBackupPath + '/daily'), 1);
filesLength(path.normalize(someProjectBackupPath + '/weekly'), 1);
filesLength(path.normalize(someProjectBackupPath + '/monthly'), 1);
filesLength(path.normalize(someProjectBackupPath + '/annually'), 1);

const todayDate = FolderBackup.formatISODate(new Date());
const todayArchive = todayDate + '.tgz';

fileExists(
  path.normalize(someProjectBackupPath + '/daily/bkp_' + todayArchive),
);
fileExists(
  path.normalize(someProjectBackupPath + '/weekly/bkp_' + todayArchive),
);
fileExists(
  path.normalize(someProjectBackupPath + '/monthly/bkp_' + todayArchive),
);
fileExists(
  path.normalize(someProjectBackupPath + '/annually/bkp_' + todayArchive),
);

console.log(
  '\x1b[32m--- Asserts for some-project2 are successfully completed! ---\x1b[0m',
);

const testProjectBackupPath = path.normalize(backupsPath + '/test-project');

folderIsNotEmpty(testProjectBackupPath);

filesLength(path.normalize(testProjectBackupPath + '/daily'), 4);
filesLength(path.normalize(testProjectBackupPath + '/weekly'), 4);
filesLength(path.normalize(testProjectBackupPath + '/monthly'), 3);
filesLength(path.normalize(testProjectBackupPath + '/annually'), 2);

fileExists(
  path.normalize(testProjectBackupPath + '/daily/bkp_' + todayArchive),
);
fileExists(
  path.normalize(testProjectBackupPath + '/weekly/bkp_' + todayArchive),
);
fileExists(
  path.normalize(testProjectBackupPath + '/monthly/bkp_' + todayArchive),
);
fileExists(
  path.normalize(testProjectBackupPath + '/annually/bkp_' + todayArchive),
);

console.log(
  '\x1b[32m--- Asserts for test-project are successfully completed! ---\x1b[0m',
);

console.log('\x1b[32m--- All test is successfully completed! ---\x1b[0m');
