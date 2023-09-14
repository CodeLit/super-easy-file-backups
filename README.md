# Super Easy backups


## Usage:

- Install Docker and Docker-compose plugin using [this link](https://docs.docker.com/compose/install/)
- Add the backup-config.json to project which you want to back up. Example:

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
    "!**/*.jar",
    "/(?<=\\/).*(\n?=\\.jar)/"
  ]
}
```

More examples you can find in **config-examples** folder.

You can also exclude files and folders from backup. Use **filter** option
with [predefined patterns](https://www.npmjs.com/package/maximatch).

- Add volumes inside super-easy-file-backups/docker-compose
- Run this command inside super-easy-file-backups folder.
```shell
docker-compose up
```

Tested on: Windows 11, Ubuntu 22.02
