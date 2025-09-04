import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';
import fs from 'fs';

// Determine environment
const env = process.env.NODE_ENV || 'development';
export type JwtAlgorithm = 'HS256' | 'HS384' | 'HS512' | 'RS256';

// Load appropriate environment file
const envFilePath = path.resolve(process.cwd(), `.env.${env}`);
if (fs.existsSync(envFilePath)) {
  dotenv.config({ path: envFilePath });
} else {
  dotenv.config(); // Fallback to .env
  console.warn(`No environment file found at ${envFilePath}, using default .env`);
}

// Define environment variable schema with validation
const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  
  // Database
  MONGODB_URI: z.string().min(1, 'MongoDB URI is required'),
  
  // JWT Auth
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT refresh secret must be at least 32 characters'),
  JWT_SESSION_SECRET: z.string().min(32, 'JWT session secret must be at least 32 characters'),
  JWT_ACCESS_EXPIRES: z.string().default('15m'),
  JWT_REFRESH_EXPIRES: z.string().default('7d'),
  
  // SMS API Configuration
  SMS_API_KEY: z.string().default(''),
  SMS_API_ENDPOINT: z.string().default('https://api.sms-provider.com/v1/send'),
  SMS_SENDER_ID: z.string().default('BLINKIT'),
  
  // Logging
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  
  // CORS
  CORS_ORIGIN: z.string().default('*')
});

// Validate and transform config
const configResult = configSchema.safeParse(process.env);

if (!configResult.success) {
  console.error('❌ Invalid environment variables:');
  console.error(configResult.error.format());
  process.exit(1);
}

// Define JWT configuration interface
export interface JwtConfig {
  secret: string;
  refreshSecret: string;
  sessionSecret: string;
  accessExpiry: string;
  refreshExpiry: string;
  algorithm: JwtAlgorithm;
  issuer: string;
}

// Define SMS configuration interface
export interface SmsConfig {
  apiKey: string;
  apiEndpoint: string;
  senderId: string;
  enabled: boolean;
}

// Export typed config
export const config = {
  env: configResult.data.NODE_ENV,
  port: configResult.data.PORT,
  
  mongodb: {
    uri: configResult.data.MONGODB_URI
  },
  
  jwt: {
    secret: configResult.data.JWT_SECRET,
    refreshSecret: configResult.data.JWT_REFRESH_SECRET,
    sessionSecret: configResult.data.JWT_SESSION_SECRET,
    accessExpiry: configResult.data.JWT_ACCESS_EXPIRES,
    refreshExpiry: configResult.data.JWT_REFRESH_EXPIRES,
    algorithm: 'HS256' as JwtAlgorithm,
    issuer: 'blinkit-api'
  } as JwtConfig,
  
  sms: {
    apiKey: configResult.data.SMS_API_KEY,
    apiEndpoint: configResult.data.SMS_API_ENDPOINT,
    senderId: configResult.data.SMS_SENDER_ID,
    // Enable SMS only if API key is provided or in development mode
    enabled: !!configResult.data.SMS_API_KEY || configResult.data.NODE_ENV === 'development'
  } as SmsConfig,
  
  logging: {
    level: configResult.data.LOG_LEVEL
  },
  
  cors: {
    origin: configResult.data.CORS_ORIGIN
  }
};