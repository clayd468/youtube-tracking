import { EventEmitter } from 'stream';
import winston from 'winston';

const LEVEL = Symbol.for('level');
const MESSAGE = Symbol.for('message');

const _logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.prettyPrint(), winston.format.json()),
  transports: [
    new winston.transports.Console({
      log(info, callback) {
        setImmediate(() => (this as EventEmitter).emit('logged', info));

        if ((this.stderrLevels as any)[info[LEVEL]]) {
          console.error(info[MESSAGE]);
          if (callback) callback();
          return;
        }

        console.log(info[MESSAGE]);
        if (callback) callback();
      },
    }),
  ],
});

const logger = {
  info: (message: string, data?: any) => _logger.info(message, { data }),
  debug: (message: string, data?: any) => _logger.debug(message, { data }),
  error: (message: string, error?: any) => _logger.error(message, error),
  warn: (message: string, data?: any) => _logger.warn(message, { data }),
};

export { logger };
