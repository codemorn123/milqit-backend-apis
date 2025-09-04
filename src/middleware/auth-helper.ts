import { Request, Response, NextFunction } from 'express';

/**
 * TSOA authentication helper function
 */
export function expressAuthentication(request: Request, securityName: string, scopes?: string[]): Promise<any> {
  // Your actual authentication logic here
  return new Promise((resolve, reject) => {
    if (securityName === 'jwt') {
      // Get the token from the request headers
      const token = request.headers.authorization?.split(' ')[1];
      
      if (!token) {
        reject(new Error('No token provided'));
        return;
      }
      
      // Simple placeholder - replace with your actual JWT verification
      if (token === 'test-token') {
        resolve({
          id: '123',
          name: 'Test User',
          roles: scopes || []
        });
      } else {
        reject(new Error('Invalid token'));
      }
    } else {
      reject(new Error(`Security definition ${securityName} is not supported`));
    }
  });
}

/**
 * This is the function TSOA is looking for in the generated routes
 */
export function expressAuthenticationRecasted(
  request: Request,
  securityName: string,
  scopes?: string[],
  response?: Response
): Promise<any> {
  // Simply pass through to your main authentication function
  return expressAuthentication(request, securityName, scopes);
}