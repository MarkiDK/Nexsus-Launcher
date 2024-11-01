// logger.js
const fs = require('fs');
const path = require('path');

class Logger {
    constructor() {
        this.logPath = path.join(__dirname, 'logs');
        this.ensureLogDirectory();
    }

    ensureLogDirectory() {
        if (!fs.existsSync(this.logPath)) {
            fs.mkdirSync(this.logPath);
        }
    }

    static log(type, message) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [${type}] ${message}\n`;
        
        // Console output
        console.log(logEntry);

        // File output
        const logFile = path.join(this.logPath, `${type.toLowerCase()}.log`);
        fs.appendFileSync(logFile, logEntry);
    }

    static error(message) {
        this.log('ERROR', message);
    }

    static info(message) {
        this.log('INFO', message);
    }

    static warn(message) {
        this.log('WARN', message);
    }

    static debug(message) {
        if (process.env.NODE_ENV === 'development') {
            this.log('DEBUG', message);
        }
    }
}

module.exports = Logger;
