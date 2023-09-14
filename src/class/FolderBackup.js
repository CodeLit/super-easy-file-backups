import currentWeekNumber from 'current-week-number';
import { COMPRESSION_LEVEL, tar } from 'zip-a-folder';
import tempDirectory from 'temp-dir';
import randomString from 'randomstring';
import fs from 'fs-extra';
import _ from 'lodash';
import { Storage as MegaStorage } from 'megajs';
import copy from 'recursive-copy';
import logger from './Logger.js';
import path from 'path';

export default class FolderBackup {
  filter;
  fm;

  constructor(options) {
    this.options = options;
    this.type = options['type'] || 'local-storage';
    this.fromFolder = options['from-folder'];
    this.pathToBackups = options['path-to-backups'];
    this.today = new Date();
  }

  static formatISODate(date) {
    const params = {};
    params.dd = String(date.getDate()).padStart(2, '0');
    params.mm = String(date.getMonth() + 1).padStart(2, '0');
    params.yyyy = date.getFullYear();
    return params.yyyy + '-' + params.mm + '-' + params.dd;
  }

  async init() {
    // fm - file manager
    const fmImport = await import('./storage_base/' + this.type + '.js');

    this.fm = new fmImport.default(this.options);

    switch (this.type) {
      case 'mega-storage':
        this.fm.storage = new MegaStorage(this.options);
        this.fm.storage.once('error', (error) => {
          logger.error(error);
        });
        await this.fm.storage.ready;
        break;
    }

    return true;
  }

  async closeConnection() {
    switch (this.type) {
      case 'mega-storage':
        await this.fm.storage.close();
    }
  }

  /**
   * Makes daily backups
   * @param count number of backups
   * @returns {Promise<void>}
   */
  async daily(count = 3) {
    await this.makeBackups(count, 'daily');
  }

  /**
   * Makes weekly backups
   * @param count number of backups
   * @returns {Promise<void>}
   */
  async weekly(count = 3) {
    await this.makeBackups(count, 'weekly');
  }

  /**
   * Makes monthly backups
   * @param count number of backups
   * @returns {Promise<void>}
   */
  async monthly(count = 3) {
    await this.makeBackups(count, 'monthly');
  }

  /**
   * Makes annually backups
   * @param count number of backups
   * @returns {Promise<void>}
   */
  async annually(count = 2) {
    await this.makeBackups(count, 'annually');
  }

  async makeBackups(count = 3, type) {
    logger.log(_.capitalize(type) + ' backups started.');
    const pathToBackups = path.normalize(this.pathToBackups + '/' + type);
    const date = FolderBackup.formatISODate(this.today);

    const pathToBackup = path.normalize(
      pathToBackups + '/bkp_' + date + '.tgz',
    );

    if (!this.fm.exists(pathToBackups)) await this.fm.makeDir(pathToBackups);

    let files = (await this.fm.readDir(pathToBackups)) || [];

    let doNotCreate = false;

    for (const file of files) {
      let fileDate = file.match(/(?<=bkp_).*?(?=\.tgz)/);
      fileDate = new Date(fileDate[0]);

      if (type === 'weekly') {
        const week = currentWeekNumber(this.today);
        const week2 = currentWeekNumber(fileDate);
        if (week === week2) {
          doNotCreate = true;
          break;
        }
      } else if (type === 'monthly') {
        if (this.today.getMonth() === fileDate.getMonth()) {
          doNotCreate = true;
          break;
        }
      } else if (type === 'annually') {
        if (this.today.getFullYear() === fileDate.getFullYear()) {
          doNotCreate = true;
          break;
        }
      }
    }

    const tmpBackupDir = path.normalize(
      tempDirectory + '/' + randomString.generate(),
    );
    const tmpArchiveDir = path.normalize(
      tempDirectory + '/' + randomString.generate(),
    );

    fs.mkdirSync(tmpBackupDir, { recursive: true });
    fs.mkdirSync(tmpArchiveDir, { recursive: true });

    await copy(this.fromFolder, tmpBackupDir, {
      filter: this.filter,
    });

    if (!this.fm.exists(pathToBackup) && !doNotCreate) {
      const tmpArchive = path.normalize(tmpArchiveDir + '/temp.tgz');

      await tar(tmpBackupDir, tmpArchive, {
        compression: COMPRESSION_LEVEL.high,
      });

      await this.fm.copy(tmpArchive, pathToBackup);
    }

    fs.rmSync(tmpBackupDir, { recursive: true });
    fs.rmSync(tmpArchiveDir, { recursive: true });

    files = (await this.fm.readDir(pathToBackups)) || [];

    const countFilesToRemove = files.length - count;

    if (files.length > 0) {
      for (let i = 0; i < countFilesToRemove; i++) {
        const fileToRemove = path.normalize(pathToBackups + '/' + files[i]);
        await this.fm.rmFile(fileToRemove);
      }
    }

    logger.log(_.capitalize(type) + ' backups is done.');
  }
}
