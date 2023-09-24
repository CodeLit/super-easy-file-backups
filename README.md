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

<pre>
📦backups
 ┣ 📂annually
 ┃ ┣ 📜bkp_2022-08-01.tgz
 ┃ ┗ 📜bkp_2023-08-01.tgz
 ┣ 📂daily
 ┃ ┣ 📜bkp_2023-09-17.tgz
 ┃ ┣ 📜bkp_2023-09-18.tgz
 ┃ ┣ 📜bkp_2023-09-19.tgz
 ┃ ┗ 📜bkp_2023-09-20.tgz
 ┣ 📂monthly
 ┃ ┣ 📜bkp_2023-08-01.tgz
 ┃ ┗ 📜bkp_2023-09-01.tgz
 ┗ 📂weekly
   ┣ 📜bkp_2023-09-06.tgz
   ┣ 📜bkp_2023-09-13.tgz
   ┗ 📜bkp_2023-09-20.tgz

</pre>

## Advanced configuration

You can also exclude files and folders from backup. Use **filter** option
with [patterns](https://www.npmjs.com/package/maximatch).

Example of backups-config.json:

```json
{
   "type": "local-storage",
   "copies": {
     "daily": 2,
     "weekly": 1,
     "monthly": 1,
     "annually": 1
   },
   "filter": [
      "node_modules/**",
      "**/*.log",
      "data/folder/*",
      "package.lock",
     "**/*_file-ending.*"
   ],
  "compression_level": "default"
}
```

### `type` option:

Type of backup, local or cloud

### `copies` option:

How many copies need to be in according folders, file tree will look like this:
<pre>
📦backups
 ┣ 📂annually
 ┃ ┗ 📜bkp_2023-09-06.tgz
 ┣ 📂daily
 ┃ ┣ 📜bkp_2023-09-06.tgz
 ┃ ┗ 📜bkp_2023-09-10.tgz
 ┣ 📂monthly
 ┃ ┗ 📜bkp_2023-09-06.tgz
 ┗ 📂weekly
 ┃ ┗ 📜bkp_2023-09-06.tgz
</pre>

### `filter` option:

- Exclude files inside **node_modules** folder recursively
- Exclude all **.log** files recursively
- Exclude all inside **data/folder** not-recursively
- Exclude **package.lock**
- Exclude files recursively by ending **_fileending**

### `compression_level` option:

- `default`: default compression, compromise between speed and compression
- `fast`: fastest compression
- `best`: best and slowest compression
- `none`: no compression

## Mega Online Cloud storage integration

[Link to official mega website](https://mega.nz/)

Config example:

```json
{
  "type": "mega-storage",
  "email": "email-name@mail.me",
  "password": "!test24passWord",
  "backups_path": "path/to/backups/my-project",
  "copies": {
    "daily": 1
  },
  "filter": [
    "**/*.log"
  ]
}
```

docker-compose.override.yml for Mega:

```yml
services:
  super-easy-file-backups:
    volumes:
      - C:/Users/Adam/Desktop/Projects/gameServer:/app/projects/gameServer:ro
```
