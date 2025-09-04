import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { config } from '../config';

export function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName === 'jwt') {
    const token = request.headers['authorization']?.split(' ')[1];
    
    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new Error('No token provided'));
        return;
      }
      
      jwt.verify(token, config.jwt.secret, (err: any, decoded: any) => {
        if (err) {
          reject(err);
          return;
        }
        
        // Ensure the user is an admin
        if (!decoded.role || !['admin', 'super_admin'].includes(decoded.role)) {
          reject(new Error('Admin access required'));
          return;
        }
        
        // Check for specific admin scopes if provided
        if (scopes && scopes.length > 0) {
          const adminPermissions = decoded.permissions || [];
          
          const hasRequiredPermission = scopes.some(scope => 
            adminPermissions.includes(scope)
          );
          
          if (!hasRequiredPermission) {
            reject(new Error('Insufficient admin permissions'));
            return;
          }
        }
        
        // Add admin user to request
        (request as any).admin = decoded;
        resolve(decoded);
      });
    });
  }
  
  return Promise.reject(new Error('Invalid security name'));
}