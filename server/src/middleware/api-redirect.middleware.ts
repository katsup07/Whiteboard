import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to redirect root-level requests to the API endpoint
 * 
 * This middleware only redirects the exact root URL '/' to the /api endpoint
 * and does not affect any other routes.
 */
export function apiRedirectMiddleware(req: Request, res: Response, next: NextFunction) {
  // Only redirect the exact root path '/' to '/api'
  if (req.method === 'GET' && (req.originalUrl === '/' || req.originalUrl === '')) {
    return res.redirect(301, '/api');
  }
  
  // Let all other requests pass through
  next();
}
