import fs from 'fs-extra';
import assert from 'node:assert';
import path from 'path';

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

/**
 * Clears the contents of a folder.
 *
 * @param {string} folderPath - The path to the folder.
 * @throws {AssertionError} If the folder is not empty.
 */
export function ensureToClearFolder(folderPath) {
  fs.emptyDirSync(folderPath);
  const files = fs.readdirSync(folderPath);
  if (files.length !== 0) {
    throw new assert.AssertionError({
      message: `Folder ${folderPath} must be empty.`,
    });
  }
}

/**
 * Checks if the given folder structure matches the expected structure.
 *
 * @param {Array|string} folders - The folders to check the structure for. If a string is provided, it is converted to an array with a single element.
 * @param {Array} structure - The expected structure of the folders.
 * @throws {AssertionError} Throws an error if the actual structure does not match the expected structure.
 */
export function structureMatch(folders, structure) {
  if (!Array.isArray(folders)) folders = [folders];

  function actualStructure(folderPath) {
    let structure = [];
    const objects = fs.readdirSync(folderPath);
    objects.forEach((obj) => {
      const isDir = fs.lstatSync(path.join(folderPath, obj)).isDirectory();
      if (isDir) {
        const subFolderStructure = actualStructure(path.join(folderPath, obj));
        subFolderStructure.forEach((subObj) => {
          structure.push(obj + '/' + subObj);
        });
      } else structure.push(obj);
    });
    return structure;
  }

  folders.forEach((folderPath) => {
    const actualStructureResult = actualStructure(folderPath);
    actualStructureResult.sort();
    structure.sort();

    if (JSON.stringify(actualStructureResult) !== JSON.stringify(structure)) {
      throw new assert.AssertionError({
        message: `Folder ${folderPath} does not match the expected structure.`,
        actual: actualStructureResult,
        expected: structure,
      });
    }
  });
}
