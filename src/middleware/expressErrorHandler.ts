import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ApiResponseDTO } from '../types/common.types';

const formatTimestamp = () => new Date().toISOString();

export function expressErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Malformed JSON from body parser
  if (err instanceof SyntaxError && 'body' in err) {
    const payload: ApiResponseDTO = {
      success: false,
      error: 'Malformed JSON in request body',
      timestamp: formatTimestamp(),
      developer: process.env.DEVELOPER_NAME || 'MarotiKathoke',
    };
    return res.status(400).json(payload);
  }

  // Zod validation error
  if (err instanceof ZodError) {
    const details = err.issues.map((i) => ({
      path: i.path.length ? i.path.join('.') : '(root)',
      message: i.message,
      code: i.code,
    }));
    const payload: ApiResponseDTO = {
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Validation error', details },
      timestamp: formatTimestamp(),
      developer: process.env.DEVELOPER_NAME || 'MarotiKathoke',
    };
    return res.status(422).json(payload);
  }

  // If error already looks like our ApiResponseDTO, pass it through
  if (err && typeof err === 'object' && 'success' in err) {
    const status = (err as any).status || 500;
    return res.status(status).json(err);
  }

  console.error('Unhandled error in expressErrorHandler:', err && err.stack ? err.stack : err);
  const payload: ApiResponseDTO = {
    success: false,
    error: 'Internal Server Error',
    timestamp: formatTimestamp(),
    developer: process.env.DEVELOPER_NAME || 'MarotiKathoke',
  };
  return res.status(500).json(payload);
}