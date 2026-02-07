import pino from 'pino';
import { config } from './index';

const level = config.logging.level || 'info';

// Set up different configurations based on environment
const pinoConfig: pino.LoggerOptions = {
  level,
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  // Format logs in development using pino-pretty
  ...(process.env.NODE_ENV !== 'production' ? {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname'
      }
    }
  } : {})
};

export const logger = pino(pinoConfig);