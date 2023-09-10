import fs from "fs-extra";

class LocalFileBase {

    /**
     * Checks if a file or folder exists.
     * @param {string} path - The path to check.
     * @returns {boolean} - Returns true if the file or folder exists, false otherwise.
     */
    exists(path) {
        // Check if the file or folder exists using the fs.existsSync() method.
        return fs.existsSync(path);
    }

    /**
     * Creates a directory at the given path.
     *
     * @param {string} path - The path where the directory should be created.
     * @returns {Promise<void>} - A promise that resolves when the directory is created successfully.
     */
    async makeDir(path) {
        // Create the directory recursively
        await fs.promises.mkdir(path, {recursive: true});
    }

    /**
     * Reads the contents of a directory and returns a sorted array of file names.
     * @param {string} path - The path to the directory.
     * @returns {string[]} - The sorted array of file names.
     */
    readDir(path) {
        // Read the contents of the directory synchronously
        let files = fs.readdirSync(path);

        // Sort the file names in ascending order
        files.sort();

        // Return the sorted array of file names
        return files;
    }

    /**
     * Removes a file.
     * @param {string} path - The path of the file to be removed.
     * @returns {boolean} - Returns true if the file is successfully removed.
     */
    rmFile(path) {
        fs.unlinkSync(path);
        return true;
    }

    /**
     * Copy a file from one location to another.
     *
     * @param {string} fromFile - The path of the file to be copied.
     * @param {string} toFile - The path where the file should be copied to.
     * @return {undefined} - This function does not return anything.
     */
    copy(fromFile, toFile) {
        return fs.copySync(fromFile, toFile, {})
    }
}

export default LocalFileBase