import fs from "fs-extra";
import path from "path";


class Logger {

    /**
     * Logs the provided arguments to the console and optionally to a log file.
     *
     * @param {...*} args - The arguments to be logged.
     */
    static log(...args) {

        const path = this.getLogPath()
        if (!fs.existsSync(path))
            fs.createFileSync(path)

        for (const a of args) {
            const logText = this.formatLogText(a);
            console.info(logText)
            fs.appendFileSync(path, `${logText}\n`)
        }
    }

    /**
     * Logs an error message.
     *
     * @param {...any} args - The error messages to be logged.
     */
    static error(...args) {
        const path = this.getLogPath()
        if (!fs.existsSync(path))
            fs.createFileSync(path)

        for (const a of args) {
            const logText = this.formatLogText('[ERROR]: ' + a);
            console.error(logText)
            fs.appendFileSync(path, `${logText}\n`)
        }
    }

    /**
     * Generates the log file path for the current date.
     *
     * @return {string} The path of the log file for the current date.
     */
    static getLogPath() {
        const mysqlFormattedDate = new Date().toISOString().split('T')[0];
        const logsPath = path.resolve('logs/backups')
        return path.normalize(`${logsPath}/${mysqlFormattedDate}.log`)
    }

    /**
     * Formats the given log text by appending the current time in HH:MM:SS format.
     *
     * @param {string} logText - The log text to be formatted.
     * @return {string} - The formatted log text with the current time.
     */
    static formatLogText(logText) {
        return `[${new Date().toLocaleTimeString()}] ${logText}`
    }
}

export default Logger