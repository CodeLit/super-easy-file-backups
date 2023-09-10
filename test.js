import {backupsPath, startBackups} from "./src/backups.js";
import path from "path";
import FolderBackup from "./src/class/FolderBackup.js";
import {fileExists, filesLength} from "./src/class/Asserts.js";

const synchronously = true

// There was a backup long time ago...
await startBackups("2020-06-21", synchronously);

// And another backup next day after first
await startBackups("2020-06-22", synchronously);
await startBackups("2021-06-23", synchronously);
await startBackups("2021-08-24", synchronously);

// Current TODAY will rewrite the old backups
await startBackups(null, synchronously);

const someProjectPath = path.normalize(backupsPath + '/some-project2')

filesLength(path.normalize(someProjectPath + '/daily'), 1);
filesLength(path.normalize(someProjectPath + '/weekly'), 1);
filesLength(path.normalize(someProjectPath + '/monthly'), 1);
filesLength(path.normalize(someProjectPath + '/annually'), 1);

const todayDate = FolderBackup.formatISODate(new Date());
const todayArchive = todayDate + '.tgz'

fileExists(path.normalize(someProjectPath + '/daily/bkp_' + todayArchive))
fileExists(path.normalize(someProjectPath + '/weekly/bkp_' + todayArchive))
fileExists(path.normalize(someProjectPath + '/monthly/bkp_' + todayArchive))
fileExists(path.normalize(someProjectPath + '/annually/bkp_' + todayArchive))

const testProjectPath = path.normalize(backupsPath + '/test-project')

filesLength(path.normalize(testProjectPath + '/daily'), 4);
filesLength(path.normalize(testProjectPath + '/weekly'), 4);
filesLength(path.normalize(testProjectPath + '/monthly'), 3);
filesLength(path.normalize(testProjectPath + '/annually'), 2);

fileExists(path.normalize(testProjectPath + '/daily/bkp_' + todayArchive))
fileExists(path.normalize(testProjectPath + '/weekly/bkp_' + todayArchive))
fileExists(path.normalize(testProjectPath + '/monthly/bkp_' + todayArchive))
fileExists(path.normalize(testProjectPath + '/annually/bkp_' + todayArchive))

console.log('\x1b[32m--- All test is successfully completed! ---\x1b[0m');