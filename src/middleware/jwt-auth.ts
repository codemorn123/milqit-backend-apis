import { Request, Response, NextFunction } from 'express';
import { tokenService } from '../services/token.service';
import { IRequest } from '../types/request.types';

export function jwtAuthMiddleware(req: IRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.replace('Bearer ', '');
  try {
    const payload = tokenService.verifyAccessToken(token);
    (req as any).user = { userId: payload.userId, roles: payload.roles };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}