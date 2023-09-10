# Super Easy backups


## Usage:

```shell
docker-compose up
```

```js
// script.js

import {FolderBackup} from "easy-backups";

// Specify project folder you want to backup, and path to backup storage
let backup = new FolderBackup({
    type: 'local',
    'from-folder': '/path/to/project',
    'path-to-backups': '/path/to/backups'
})

// Initialize file system, await required
await backup.init()

await backup.daily(5) // Last 5 days will be saved
await backup.weekly(3) // Last 3 week will be saved
await backup.monthly(3) // Last 3 months will be saved
await backup.annually(2) // Last 2 years will be saved
// You can use them without "await".
```

### Now you can add this script to your cron as cron job for every day.

```shell
node script.js
```

## Extended options:

```js
let backup = new FolderBackup({
    type: 'local',
    'from-folder': '/path/to/project',
    'path-to-backups': '/path/to/backups',
    'no-info-messages': true, // Disabling info messages from console.info
    'log-file': '/path/to/log-file.log', // Writing backups log
})

backup.today = new Date("2020-06-21"); // Change backup date

backup.filter = [
    '**', // Add all files to filter
    '!**/*.jar', // Exclude .jar files from filter
    '!**/*.bin', // Exclude .bin files from filter
    // It also supports patterns etc.
    /^(?!.*\.log)/, // Exclude .log files from filter
    // For more info - https://www.npmjs.com/package/maximatch
]

await backup.daily(2) // Last 2 days will be saved

/* For mega integration use */
// await backup.closeConnection()
```

## Mega storage integration [(official site)](https://mega.io/)

```js
import {FolderBackup} from "easy-backups";

// Read config file with sensitive data
let config = fs.readFileSync('/path/to/config.json');
config = JSON.parse(config);

let backup = new FolderBackup({
    type: 'mega',
    email: config.email,
    password: config.password,
    'from-folder': 'path/to/project',
    'path-to-backups': 'path/to/backups'
})

// Initialize file system, await required
await backup.init()

await backup.daily(2) // await required
await backup.weekly(2)
await backup.monthly(2)
await backup.annually(2)

// Necessarily close connection after backup to prevent program from not responding
await backup.closeConnection()
```

Backup filters: https://www.npmjs.com/package/maximatch

Tested on: Windows, Ubuntu 22.02