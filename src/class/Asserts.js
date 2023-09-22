import fs from 'fs-extra';
import assert from 'node:assert';
import path from 'path';

/**
 * Checks if a file exists.
 *
 * @param {string} filePath - The path to the file.
 * @return {undefined}
 */
export function fileExists(filePath) {
  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    throw new assert.AssertionError({
      message: `File ${path.basename(filePath)} does not exist.`,
      expected: path.basename(filePath),
      actual: fs.readdirSync(path.dirname(filePath)).join(', '),
    });
  }
}

/**
 * Asserts that the number of files in a given folder is equal to a specified length.
 *
 * @param {string} folderPath - The path to the folder.
 * @param {number} length - The expected number of files.
 * @throws {assert.AssertionError} If the number of files is greater than the specified length.
 */
export function filesLength(folderPath, length) {
  // Get the list of files in the folder
  const files = fs.readdirSync(folderPath);
  if (files.length > length) {
    throw new assert.AssertionError({
      message: `Folder ${folderPath} does not contain the expected number of files.`,
      actual: files.length,
      expected: length,
    });
  }
}

/**
 * Checks if a folder is not empty.
 *
 * @param {string} folderPath - The path to the folder.
 * @return {void} Throws an exception if the folder is empty.
 */
export function folderIsNotEmpty(folderPath) {
  // Get the list of files in the folder
  const files = fs.readdirSync(folderPath);
  if (files.length === 0) {
    throw new assert.AssertionError({
      message: `Folder ${folderPath} is empty.`,
    });
  }
}
