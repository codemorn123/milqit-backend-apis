import fs from 'fs';
import path from 'path';
// import envConfig from '../../config/env';
// import { isProd } from '../../utils/isProd';
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, label, printf } = format;

// check if logs directory exists
const LOGS_DIR = 'logs';

if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR);
}

const TIMESTAMP_FORMAT = 'DD-MM-YYYY HH:mm:ss';
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} ${label} [${level}]: ${message}`;
});

class Logger {
  public createLogger() {
    // if (isProd) {
    //   return this.prodLogger();
    // }
    return this.devLogger();
  }

  private devLogger() {
    return createLogger({
      level: 'debug',
      format: combine(
        format.colorize(),
        // label({ label: envConfig.nodeEnv }),
            label({ label: "Dev" }),
        timestamp({ format: TIMESTAMP_FORMAT }),
        myFormat
      ),
      transports: [new transports.Console()]
    });
  }

  private prodLogger() {
    return createLogger({
      level: 'warn',
      format: combine(
        // label({ label: envConfig.nodeEnv }),
          label({ label: "Prod" }),
        timestamp({ format: TIMESTAMP_FORMAT }),
        myFormat
      ),
      transports: [
        new transports.File({
          filename: path.join(LOGS_DIR, 'error.log'),
          level: 'error'
        }),
        new transports.Console()
      ]
    });
  }
}

export default Logger;