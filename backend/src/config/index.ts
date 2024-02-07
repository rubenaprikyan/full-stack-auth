import dotenv from 'dotenv';
import path from 'path';
import { URL } from 'url';

// eslint-disable-next-line no-underscore-dangle
const __dirname = new URL('.', import.meta.url).pathname;

dotenv.config({
  path: path.join(__dirname, '../../', '.env'),
});

const intConf = (value: string | number): number =>
  typeof value === 'string' ? parseInt(value, 10) : value;

/**
 * DATABASE config variables
 */
export const dbConfig = {
  host: process.env.DB_HOST || '',
  database: process.env.DB_NAME || '',
  username: process.env.DB_USERNAME || '',
  password: process.env.DB_PASSWORD || '',
  port: intConf(process.env.DB_PORT || 5432),
  logging:
    // eslint-disable-next-line no-constant-condition
    Boolean(intConf(process.env.DB_LOGGING || 0)) || true
      ? false
      : // eslint-disable-next-line no-undef, no-console
        console.log.bind(console),
  type: process.env.DB_DIALECT || 'postgres',
};

/**
 * SERVER config variables
 */
export const serverConfig = {
  host: process.env.HOST,
  port: parseInt(process.env.PORT || '', 10),
};

/**
 * AUTH config variables
 */
export const authConfig = {
  accessTokenSecret: process.env.AUTH_TOKEN_SECRET || '',
  accessTokenLifetime: intConf(process.env.AUTH_TOKEN_LIFETIME || 300),
};

/**
 * AWS S3 credentials
 */
export const awsS3Config = {
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
};

/**
 * CORS whitelist variables
 */
export const whiteList = process.env.CORS_WHITE_LIST;
