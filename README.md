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
  }
}
```

More examples you can find in `config-examples` folder.

3. Add folder paths of your projects inside `super-easy-file-backups/docker-compose.override.yml`.

```yml
services:
  super-easy-file-backups:
    volumes:
      - C:/Users/Adam/webServer:/app/projects/webServer # from
      - C:/Users/Adam/backups/webServer:/app/backups/webServer # to
```

You can find more examples in `docker-compose.override-example.yml`.
4. Run this command inside `super-easy-file-backups` folder.
```shell
docker-compose up
```

5. Check out the result.

## Advanced configuration

You can also exclude files and folders from backup. Use **filter** option
with [predefined patterns](https://www.npmjs.com/package/maximatch).

```js
const backup_config_json = {
   "type": "local-storage",
   "filter": [
      "/node_modules/**", // exclude node_modules folder recursively
      "!**/*.bin", // exclude .bin files from filter
      "/data/logs/**",
      "/package.lock",
      "/(?<=\\/).*(\n?=\\.log)/", // filtering .log files using regular expression
      "**" // exclude all files
   ]
}
```

## Mega Online Cloud storage integration

[Link to official mega website](https://mega.nz/)

Config example:

```json
{
  "type": "mega-storage",
  "email": "email-name@mail.me",
  "password": "!test24passWord",
  "copies": {
    "daily": 1,
    "weekly": 1,
    "monthly": 1,
    "annually": 1
  }
}
```
