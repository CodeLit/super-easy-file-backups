import fs from 'fs-extra';
import assert from 'node:assert';

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
      message: `File ${filePath} does not exist.`,
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
