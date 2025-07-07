import fs from 'fs';
import path from 'path';

export class LogHelper {
    static logError(error) {
        const logPath = process.env.LOG_FILE_PATH ?? './logs/error.log';
        const logDir = path.dirname(logPath);
        if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

        const logMsg = `[${new Date().toISOString()}] ${error?.stack || error}\n`;
        fs.appendFileSync(logPath, logMsg);
        console.error(error);
    }
}
