import winston from 'winston';
import { config } from './index';

// Define log format
const logFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}] : ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += JSON.stringify(metadata);
  }
  return msg;
});

// Configure Winston Logger
const winstonInstance = winston.createLogger({
  level: config.logging.level || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.splat(),
    winston.format.json() // Default to JSON for better parsing
  ),
  transports: [
    // Console transport for development/production
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Add colors for console
        winston.format.simple(), // Simple format
        logFormat // Apply custom format
      ),
    }),
    // Optionally add File transport here
    // new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Wrapper to support both (message, meta) and (meta, message) signatures
type LogMethod = {
  (message: string, ...meta: any[]): winston.Logger;
  (infoObject: object, message?: string, ...meta: any[]): winston.Logger;
};

type WrappedLogger = Omit<winston.Logger, 'info' | 'error' | 'warn' | 'debug'> & {
  info: LogMethod;
  error: LogMethod;
  warn: LogMethod;
  debug: LogMethod;
};

export const logger = new Proxy(winstonInstance, {
  get(target, prop, receiver) {
    if (typeof prop === 'string' && ['info', 'error', 'warn', 'debug'].includes(prop)) {
      return (arg1: any, arg2?: any, ...args: any[]) => {
        // Support (object, message) signature commonly used in the codebase
        if (typeof arg1 === 'object' && typeof arg2 === 'string') {
          return target[prop as keyof winston.Logger](arg2, arg1, ...args);
        }
        // distinct handle for (object) single argument which winston supports as info(obj)
        // strict winston: info(msg, meta)
        return target[prop as keyof winston.Logger](arg1, arg2, ...args);
      };
    }
    return Reflect.get(target, prop, receiver);
  },
}) as unknown as WrappedLogger;

// Create a stream object with a 'write' function that will be used by `morgan`
export const stream = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};