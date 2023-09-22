# Super Easy backups

- #### Easy to set up (about 5 minutes)
- #### Removes old backups (backups rotation), saving space on your device
- #### Multiple annual, monthly, weekly backups by your choice

Tested on: Windows 11, Ubuntu 22.02

## Usage:

1. Install Docker and Docker-compose plugin using [this link](https://docs.docker.com/compose/install/)
2. Add the `your-project/backups-config.json` to project which folder you want to back up. Example:

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
with [patterns](https://www.npmjs.com/package/maximatch).

```js
// Example of backups-config.json :
{
   "type": "local-storage",
   "filter": [
      "node_modules/**", // exclude files inside node_modules folder recursively
      "**/*.log", // exclude all .log files recursively
      "data/folder/*", // exclude all inside data/folder not-recursively
      "package.lock", // exclude package.lock
      "**/*_fileending.*" // exclude files recursively by ending _fileending
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
