import { auth } from 'express-oauth2-jwt-bearer';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { findOrCreateUserByAuth0Id } from '../schema/user.js';
import logger from '../utils/logger.js';

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

    // Namespace for custom Auth0 claims
    const namespace = process.env.AUTH0_NAMESPACE;
    if (!namespace) {
      res.status(500).json({ error: 'Missing AUTH0_NAMESPACE environment variable' });
      return;
    }
    
    // Extract email from token claims (optional - may not be in access token)
    const email = auth?.payload?.email || 
                  auth?.payload?.[`${namespace}/email`] || 
                  null;

    // Extract name fields from token
    // Auth0 can provide: name (full name), given_name (first), family_name (last)
    let firstName = auth?.payload?.given_name || 
                    auth?.payload?.[`${namespace}/given_name`] || 
                    null;
    let lastName = auth?.payload?.family_name || 
                   auth?.payload?.[`${namespace}/family_name`] || 
                   null;
    
    // If no given/family names, try to split the full name
    const fullName = auth?.payload?.name || auth?.payload?.[`${namespace}/name`];
    if (!firstName && !lastName && fullName) {
      const nameParts = fullName.split(' ');
      firstName = nameParts[0];
      if (nameParts.length > 1) {
        lastName = nameParts.slice(1).join(' ');
      }
    }

    logger.info('Auth0 user data', { auth0Id, email, firstName, lastName });

    // Find or create the user in our database
    const user = await findOrCreateUserByAuth0Id(auth0Id, email, firstName, lastName);
    (req as AuthenticatedRequest).user = user;
    
    next();
  } catch (error: any) {
    logger.error('Error attaching user', { error: error.message });
    res.status(500).json({ error: error.message });
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
