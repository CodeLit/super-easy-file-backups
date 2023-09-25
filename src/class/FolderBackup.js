import _ from 'lodash';
import { Storage as MegaStorage } from 'megajs';
import logger from './Logger.js';
import path from 'path';
import archiver from 'archiver';
import fs from 'fs-extra';
import zlib from 'zlib';
import randomString from 'randomstring';

const temporaryFolder = path.resolve('temp');

export default class FolderBackup {
  filter;
  fm;

  constructor(options) {
    this.options = options;
    this.type = options.type || 'local-storage';
    this.fromFolder = options.fromFolder;
    this.pathToBackups = options.pathToBackups;
    this.today = new Date();
    this.compressionLevel = zlib.constants.Z_DEFAULT_COMPRESSION;
  }

  /**
   * Formats the given date into ISO format.
   *
   * @param {Date} date - The date to be formatted.
   * @return {string} The formatted date in ISO format (YYYY-MM-DD).
   */
  static formatISODate(date) {
    const params = {};
    params.dd = String(date.getDate()).padStart(2, '0');
    params.mm = String(date.getMonth() + 1).padStart(2, '0');
    params.yyyy = date.getFullYear();
    return params.yyyy + '-' + params.mm + '-' + params.dd;
  }

  /**
   * Initializes the backup's storage.
   *
   * @return {boolean} - True if the function is successfully initialized.
   */
  async init() {
    // fm - file manager
    let fmImport;

    // Static paths is used for ide autocompletion
    switch (this.type) {
      case 'local-storage':
        fmImport = await import('./storage_base/local-storage.js');
        break;
      case 'mega-storage':
        fmImport = await import('./storage_base/mega-storage.js');
        break;
      default:
        fmImport = await import('./storage_base/' + this.type + '.js');
        break;
    }

    this.fm = new fmImport.default(this.options);

    switch (this.type) {
      case 'mega-storage':
        this.fm.storage = new MegaStorage(this.options);
        this.fm.storage.once('error', (error) => {
          logger.error(error.stack);
        });
        await this.fm.storage.ready;
        break;
    }

    return true;
  }

  /**
   * Closes the connection to the storage.
   *
   * @return {Promise<void>} A promise that resolves when the connection is closed.
   */
  async closeConnection() {
    switch (this.type) {
      case 'mega-storage':
        await this.fm.storage.close();
    }
  }

  /**
   * Makes backups.
   *
   * @param {number} backupsCount - The number of backups to keep.
   * @param {string} type - The type of backups to make (weekly, monthly, annually).
   * @return {void}
   */
  async makeBackups(backupsCount, type) {
    logger.log(_.capitalize(type) + ' backups started.');
    const pathToBackups = path.normalize(this.pathToBackups + '/' + type);
    const date = FolderBackup.formatISODate(this.today);

    const pathToBackup = path.normalize(
      pathToBackups + '/bkp_' + date + '.tgz',
    );

    if (!this.fm.exists(pathToBackups)) await this.fm.makeDir(pathToBackups);

    let files = (await this.fm.readDir(pathToBackups)) || [];

    let oldestFileDate;

    for (const file of files) {
      let fileDate = file.match(/(?<=bkp_).*?(?=\.tgz)/);
      fileDate = new Date(fileDate[0]);
      if (!oldestFileDate || fileDate < oldestFileDate) {
        oldestFileDate = fileDate;
      }
    }
    let doNotCreate = false;

    if (oldestFileDate && oldestFileDate < this.today) {
      const todayDays = this.today.getTime() / (1000 * 60 * 60 * 24);
      const oldestDays = oldestFileDate.getTime() / (1000 * 60 * 60 * 24);

      if (type === 'weekly' && todayDays - oldestDays < 7) {
        doNotCreate = true;
      } else if (type === 'monthly' && todayDays - oldestDays < 31) {
        doNotCreate = true;
      } else if (type === 'annually' && todayDays - oldestDays < 366) {
        doNotCreate = true;
      }
    }

    if (!doNotCreate) {
      const tmpArchive = path.normalize(
        temporaryFolder + '/' + randomString.generate() + '.tgz',
      );

      let destination = pathToBackup;

      if (this.type === 'mega-storage') {
        fs.mkdirSync(temporaryFolder, { recursive: true });
        destination = tmpArchive;
      }

      const archive = archiver('tar', {
        gzip: true,
        gzipOptions: { level: this.compressionLevel }, // Sets the compression level.
      });

      archive.pipe(fs.createWriteStream(destination));

      archive.glob(
        '**/*',
        {
          cwd: this.fromFolder,
          ignore: this.filter,
        },
        {},
      );

      await archive.finalize();

      if (this.type === 'mega-storage') {
        await this.fm.copy(tmpArchive, pathToBackup);
        fs.rmSync(tmpArchive);
      }
    }

    files = (await this.fm.readDir(pathToBackups)) || [];

    const countFilesToRemove = files.length - backupsCount;

    if (files.length > 0) {
      for (let i = 0; i < countFilesToRemove; i++) {
        const fileToRemove = path.normalize(pathToBackups + '/' + files[i]);
        await this.fm.rmFile(fileToRemove);
      }
    }

    logger.log(_.capitalize(type) + ' backups is done.');
  }
}
