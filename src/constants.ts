import { connect } from '@permaweb/aoconnect';
import { PermissionType } from 'arconnect';
import Arweave from 'arweave';
import { ArweaveWebWallet } from 'arweave-wallet-connector';
import winston, { createLogger, format, transports } from 'winston';

import { Logger } from '../types/index.js';

export const THEME_TYPES = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const PROFILE_REGISTRY_ID =
  'iySPL7MpiZCvei0DIFzjNOudjbCnHHXf9rPgbXH-T90';

export class DefaultLogger implements Logger {
  private logger: winston.Logger;
  constructor({
    level = 'info',
    logFormat = 'simple',
  }: {
    level?: 'info' | 'debug' | 'error' | 'none' | undefined;
    logFormat?: 'simple' | 'json' | undefined;
  } = {}) {
    this.logger = createLogger({
      level,
      silent: level === 'none',
      format: getLogFormat(logFormat),
      transports: [new transports.Console()],
    });
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  info(message: string, ...args: any[]) {
    this.logger.info(message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.logger.warn(message, ...args);
  }

  error(message: string, ...args: any[]) {
    this.logger.error(message, ...args);
  }

  debug(message: string, ...args: any[]) {
    this.logger.debug(message, ...args);
  }

  setLogLevel(level: string) {
    this.logger.level = level;
  }

  setLogFormat(logFormat: string) {
    this.logger.format = getLogFormat(logFormat);
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

function getLogFormat(logFormat: string) {
  return format.combine(
    format((info) => {
      if (info.stack && info.level !== 'error') {
        delete info.stack;
      }
      return info;
    })(),
    format.errors({ stack: true }), // Ensure errors show a stack trace
    format.timestamp(),
    logFormat === 'json' ? format.json() : format.simple(),
  );
}

export const DEFAULT_AO = connect();

export const DEFAULT_ARWEAVE = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
});

export const APP_PERMISSIONS: PermissionType[] = [
  'ACCESS_ADDRESS',
  'ACCESS_ALL_ADDRESSES',
  'ACCESS_PUBLIC_KEY',
  'SIGN_TRANSACTION',
  'ACCESS_ARWEAVE_CONFIG',
  'SIGNATURE',
];

export const ARWEAVE_APP_API = new ArweaveWebWallet(
  { name: 'ArNS' },
  { state: { url: 'arweave.app' } },
);
