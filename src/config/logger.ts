import pino from 'pino';
import { config } from './index';
const level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';


// Set up different configurations based on environment
const pinoConfig: pino.LoggerOptions = {
  level: config.logging.level,
  
  // Format logs in development
  ...(config.env === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname'
      }
    }
  })
};

// export const logger = pino(pinoConfig);

export const logger = pino({
  level,
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
});