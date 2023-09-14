import fs from 'fs-extra';

class MegaFileBase {
  storage;

  /**
   * Finds a file or folder
   * @param path
   * @returns MutableFile
   */
  find(path) {
    // Split path into array
    path = path.split('/');

    let result = false;

    function findObject(nextObj) {
      if (!nextObj.directory || !nextObj.children) return;

      let found = nextObj.children.find((obj) => obj.name === path[0]);

      if (found) {
        path.shift();
        if (path.length === 0) {
          result = found;
          return;
        }
        findObject(found);
      }
    }

    findObject(this.storage.root);

    return result;
  }

  /**
   * Is file or folder exists
   * @param path
   * @returns {boolean}
   */
  exists(path) {
    let obj = this.find(path);
    return obj !== false;
  }

  async makeDir(path) {
    path = path.split('/');

    async function findObject(nextObj) {
      if (!nextObj.directory || path.length === 0) return;

      let children = nextObj.children || [];
      let found = children.find((obj) => obj.name === path[0]);

      if (found === undefined) {
        found = await nextObj.mkdir(path[0]);
      }

      await path.shift();

      await findObject(found);
    }

    await findObject(this.storage.root);
    return true;
  }

  /**
   * Reads a directory
   * @param path
   */
  readDir(path) {
    let filesInDir = [];

    let dir = this.find(path);

    if (!dir) return false;

    // Returns files and folders in root directory
    for (const file of dir.children || []) {
      if (!file.directory) filesInDir.push(file.name);
    }

    // Возвращает все файлы и папки, в том числе корзину, Inbox и прочие
    // for (const file of Object.values(this.storage.files)) {
    //     console.warn(file.name)
    // }

    filesInDir.sort();

    return filesInDir;
  }

  /**
   * Removes a file. Return true if successfully
   * @param path
   * @returns {boolean}
   */
  async rmFile(path) {
    let file = this.find(path);
    if (file) {
      await file.delete(true);
      return true;
    } else return false;
  }

  /**
   * Uploads file to server
   * @param fromFile
   * @param toFile
   */
  async copy(fromFile, toFile) {
    let toFileArr = toFile.split('/');
    let toFileName = toFileArr.pop();
    let dir = this.find(toFileArr.join('/'));

    const uploadStream = dir.upload(
      {
        name: toFileName,
        allowUploadBuffering: true,
      },
      fs.createReadStream(fromFile),
    );

    await uploadStream.complete;
  }
}

export default MegaFileBase;
