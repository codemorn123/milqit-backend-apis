import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

/**
 * Request timeout middleware
 * Prevents requests from hanging indefinitely which causes 502 errors
 */
export const requestTimeout = (timeoutMs: number = 30000) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Set a timeout for the request
        const timeout = setTimeout(() => {
            if (!res.headersSent) {
                logger.error({
                    method: req.method,
                    url: req.url,
                    timeout: timeoutMs
                }, 'Request timeout');

                res.status(504).json({
                    success: false,
                    error: 'Request timeout - the server took too long to respond'
                });
            }
        }, timeoutMs);

        // Clear timeout when response finishes
        res.on('finish', () => {
            clearTimeout(timeout);
        });

        // Clear timeout on error
        res.on('close', () => {
            clearTimeout(timeout);
        });

        next();
    };
};

/**
 * Async error wrapper
 * Catches errors in async route handlers
 */
export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

/**
 * Health check with database status
 */
export const enhancedHealthCheck = async (req: Request, res: Response) => {
    try {
        const mongoose = require('mongoose');
        const dbStatus = mongoose.connection.readyState;
        const statusMap: Record<number, string> = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };

        const health = {
            status: dbStatus === 1 ? 'ok' : 'degraded',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            database: {
                status: statusMap[dbStatus] || 'unknown',
                connected: dbStatus === 1
            },
            memory: {
                used: Math.round(process.memoryUsage().rss / (1024 * 1024)),
                total: Math.round(process.memoryUsage().heapTotal / (1024 * 1024))
            }
        };

        const statusCode = health.status === 'ok' ? 200 : 503;
        res.status(statusCode).json(health);
    } catch (error) {
        logger.error({ error }, 'Health check failed');
        res.status(503).json({
            status: 'error',
            message: 'Health check failed'
        });
    }
};
