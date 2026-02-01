import { Request, Response, NextFunction } from 'express';
import { performance } from 'perf_hooks';
import { logger } from '../config/logger';

/**
 * Performance Monitoring Middleware
 * Tracks API response times and logs slow endpoints
 */
export const performanceMonitor = (req: Request, res: Response, next: NextFunction) => {
    const startTime = performance.now();
    const path = req.path;
    const method = req.method;

    // Store start time in request
    (req as any).startTime = startTime;

    // Listen for response finish
    res.on('finish', () => {
        const endTime = performance.now();
        const duration = endTime - startTime;

        // Log slow requests (over 1 second)
        if (duration > 1000) {
            logger.warn({
                type: 'SLOW_REQUEST',
                method,
                path,
                duration: `${duration.toFixed(2)}ms`,
                statusCode: res.statusCode,
            }, `Slow API endpoint detected: ${method} ${path}`);
        }

        // Log very slow requests (over 2 seconds)
        if (duration > 2000) {
            logger.error({
                type: 'VERY_SLOW_REQUEST',
                method,
                path,
                duration: `${duration.toFixed(2)}ms`,
                statusCode: res.statusCode,
            }, `Critical: Very slow API endpoint: ${method} ${path}`);
        }

        // Add response time header
        res.setHeader('X-Response-Time', `${duration.toFixed(2)}ms`);
    });

    next();
};

/**
 * Get request duration
 */
export const getRequestDuration = (req: Request): number => {
    const startTime = (req as any).startTime;
    if (!startTime) return 0;
    return performance.now() - startTime;
};
