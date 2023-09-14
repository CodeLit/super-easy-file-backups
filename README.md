# Super Easy backups

- #### Easy to set up (about 5 minutes)
- #### Removes old backups (backups rotation), saving space on your device
- #### Multiple annual, monthly, weekly backups by your choice

Tested on: Windows 11, Ubuntu 22.02

## Usage:

1. Install Docker and Docker-compose plugin using [this link](https://docs.docker.com/compose/install/)
2. Add the `your-project/backup-config.json` to project which folder you want to back up. Example:

```json
{
  "type": "local-storage",
  "copies": {
    "daily": 4,
    "weekly": 3,
    "monthly": 2,
    "annually": 2
  },
  "filter": [
    "**",
    "!**/*.bin",
    "/(?<=\\/).*(\n?=\\.log)/"
  ]
}
```

More examples you can find in `config-examples` folder.

You can also exclude files and folders from backup. Use **filter** option
with [predefined patterns](https://www.npmjs.com/package/maximatch).

3. Add folder paths of your projects inside `super-easy-file-backups/docker-compose.override.yml`.
   You can find examples in `docker-compose.override-example.yml`.
4. Run this command inside `super-easy-file-backups` folder.
```shell
docker-compose up
```

5. Check out the result.

