import jwt, { JwtPayload } from 'jsonwebtoken';
import { accessTokenOptions, jwtConfig, refreshTokenOptions } from '../config/jwt.config';

export interface AuthTokenPayload extends JwtPayload {
    userId: string;
    roles: string[];
}

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: string; // in seconds
}

export const tokenService = {
    generateAuthTokens(userId: string, roles: string[]): TokenResponse {
        const payload = { userId, roles };
        const accessToken = jwt.sign(payload, jwtConfig.secret, accessTokenOptions);
        const refreshToken = jwt.sign(payload, jwtConfig.refreshSecret, refreshTokenOptions);
        return { accessToken, refreshToken, expiresIn: jwtConfig.accessExpiresIn };
    },
    verifyRefreshToken(token: string): AuthTokenPayload {
        return jwt.verify(token, jwtConfig.refreshSecret, {
            issuer: jwtConfig.issuer,
            algorithms: [jwtConfig.algorithm],
        }) as AuthTokenPayload;
    },
};