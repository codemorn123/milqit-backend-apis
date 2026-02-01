import { Response } from 'express';

export type CookieEnvironment = 'development' | 'production';

export interface CookieOptions {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    maxAge?: number;
    domain?: string;
    path?: string;
}

/**
 * Cookie configuration helper for authentication tokens
 */
export class CookieHelper {
    private static readonly ACCESS_TOKEN_COOKIE = 'access_token';
    private static readonly REFRESH_TOKEN_COOKIE = 'refresh_token';

    /**
     * Get cookie options based on environment
     */
    private static getCookieOptions(environment: CookieEnvironment, maxAge: number): CookieOptions {
        const isDevelopment = environment === 'development';

        return {
            httpOnly: true, // Prevents JavaScript access (XSS protection)
            secure: !isDevelopment, // HTTPS only in production
            sameSite: isDevelopment ? 'lax' : 'strict', // CSRF protection
            maxAge: maxAge * 1000, // Convert to milliseconds
            path: '/',
            // For localhost testing, don't set domain
            // For production, you can set your domain here
            domain: isDevelopment ? undefined : undefined, // e.g., '.yourdomain.com'
        };
    }

    /**
     * Set access token cookie
     * @param res - Express response object
     * @param token - Access token string
     * @param expiresIn - Expiration time in seconds (default: 1 hour)
     */
    public static setAccessToken(
        res: Response,
        token: string,
        expiresIn: number = 3600
    ): void {
        const environment = (process.env.NODE_ENV as CookieEnvironment) || 'development';
        const options = this.getCookieOptions(environment, expiresIn);

        res.cookie(this.ACCESS_TOKEN_COOKIE, token, options);
    }

    /**
     * Set refresh token cookie
     * @param res - Express response object
     * @param token - Refresh token string
     * @param expiresIn - Expiration time in seconds (default: 7 days)
     */
    public static setRefreshToken(
        res: Response,
        token: string,
        expiresIn: number = 604800 // 7 days
    ): void {
        const environment = (process.env.NODE_ENV as CookieEnvironment) || 'development';
        const options = this.getCookieOptions(environment, expiresIn);

        res.cookie(this.REFRESH_TOKEN_COOKIE, token, options);
    }

    /**
     * Set both access and refresh tokens
     */
    public static setAuthTokens(
        res: Response,
        accessToken: string,
        refreshToken: string,
        accessExpiresIn: number = 3600,
        refreshExpiresIn: number = 604800
    ): void {
        this.setAccessToken(res, accessToken, accessExpiresIn);
        this.setRefreshToken(res, refreshToken, refreshExpiresIn);
    }

    /**
     * Clear access token cookie
     */
    public static clearAccessToken(res: Response): void {
        res.clearCookie(this.ACCESS_TOKEN_COOKIE, { path: '/' });
    }

    /**
     * Clear refresh token cookie
     */
    public static clearRefreshToken(res: Response): void {
        res.clearCookie(this.REFRESH_TOKEN_COOKIE, { path: '/' });
    }

    /**
     * Clear all authentication cookies
     */
    public static clearAuthTokens(res: Response): void {
        this.clearAccessToken(res);
        this.clearRefreshToken(res);
    }

    /**
     * Get access token from cookies
     */
    public static getAccessToken(req: any): string | undefined {
        return req.cookies?.[this.ACCESS_TOKEN_COOKIE];
    }

    /**
     * Get refresh token from cookies
     */
    public static getRefreshToken(req: any): string | undefined {
        return req.cookies?.[this.REFRESH_TOKEN_COOKIE];
    }
}

export default CookieHelper;
