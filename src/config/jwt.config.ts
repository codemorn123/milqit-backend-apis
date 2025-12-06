import { SignOptions } from 'jsonwebtoken';
import { config } from './index';

export const jwtConfig = {
    secret: config.jwt.secret,
    refreshSecret: config.jwt.refreshSecret,
    issuer: config.jwt.issuer,
    algorithm: config.jwt.algorithm,
    accessExpiresIn: config.jwt.accessExpiry,
    refreshExpiresIn: config.jwt.refreshExpiry,
};

// Pre-configured options for JWT signing
export const accessTokenOptions: SignOptions = {
    issuer: jwtConfig.issuer,
    algorithm: jwtConfig.algorithm,
    expiresIn: jwtConfig.accessExpiresIn as any,
};

export const refreshTokenOptions: SignOptions = {
    issuer: jwtConfig.issuer,
    algorithm: jwtConfig.algorithm,
    expiresIn: jwtConfig.refreshExpiresIn as any,
};