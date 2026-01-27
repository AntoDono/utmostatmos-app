import { auth } from 'express-oauth2-jwt-bearer';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { findOrCreateUserByAuth0Id } from '../schema/user.js';

// JWT validation middleware - validates the Auth0 access token
export const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  tokenSigningAlg: 'RS256'
});

// User type from database
export interface DbUser {
  id: string;
  auth0Id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  leaderboardScore: number;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// Extended request type with user info
export interface AuthenticatedRequest extends Request {
  user?: DbUser;
}

// Middleware to attach local user to request after JWT validation
export const attachUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // The auth middleware adds 'auth' to the request
    const auth = (req as any).auth;
    const auth0Id = auth?.payload?.sub;
    
    if (!auth0Id) {
      res.status(401).json({ error: 'No user identifier in token' });
      return;
    }

    // Extract email from token claims (Auth0 includes this in the access token if configured)
    const email = auth?.payload?.email || 
                  auth?.payload?.['https://utmostatmos.com/email'] || 
                  `${auth0Id}@auth0.user`;

    // Find or create the user in our database
    const user = await findOrCreateUserByAuth0Id(auth0Id, email);
    (req as AuthenticatedRequest).user = user;
    
    next();
  } catch (error: any) {
    console.error('Error attaching user:', error);
    res.status(500).json({ error: 'Failed to process user' });
  }
};

// Combined middleware: validate JWT then attach user
export const requireAuth: RequestHandler[] = [checkJwt as RequestHandler, attachUser];

// Optional auth - doesn't fail if no token, but attaches user if present
export const optionalAuth: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token provided, continue without user
    next();
    return;
  }

  // If token is provided, validate it and attach user
  (checkJwt as RequestHandler)(req, res, (err) => {
    if (err) {
      // Token invalid, continue without user (optional auth)
      next();
      return;
    }
    attachUser(req, res, next);
  });
};
