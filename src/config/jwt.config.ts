import { Algorithm, SignOptions } from 'jsonwebtoken';

const getEnv = (key: string, defaultValue: string): string => process.env[key] || defaultValue;

const getEnvAsInt = (key: string, defaultValue: number): number => {
    const value = process.env[key];
    return value ? parseInt(value, 10) : defaultValue;
};

export const jwtConfig = {
    secret: getEnv('JWT_SECRET', 'your-default-secret-key'),
    refreshSecret: getEnv('JWT_REFRESH_SECRET', 'your-default-refresh-secret-key'),
    issuer: getEnv('JWT_ISSUER', 'api.yourapp.com'),
    algorithm: getEnv('JWT_ALGORITHM', 'HS256') as Algorithm,
    accessExpiresIn: '7d', // Keep it simple, e.g., '15m', '1h', '7d'
    refreshExpiresIn: '9d',
};

// Pre-configured options for JWT signing
export const accessTokenOptions: SignOptions = {
    issuer: jwtConfig.issuer,
    algorithm: jwtConfig.algorithm,
    expiresIn:parseInt(jwtConfig.accessExpiresIn),
};

export const refreshTokenOptions: SignOptions = {
    issuer: jwtConfig.issuer,
    algorithm: jwtConfig.algorithm,
    expiresIn: parseInt(jwtConfig.refreshExpiresIn),
};