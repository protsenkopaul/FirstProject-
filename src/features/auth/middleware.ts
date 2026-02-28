import { MiddlewareHandler } from 'hono';
import { JWTPayload } from '../../schemas.js';
import { verifyToken } from './service.js';

export type Variables = {
  user: JWTPayload;
};

export const authMiddleware: MiddlewareHandler<{ Variables: Variables }> = async (c, next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Missing or invalid Authorization header' }, 401);
  }
  
  const token = authHeader.substring(7);
  
  try {
    const user = await verifyToken(token);
    
    c.set('user', user);
    
    await next();
  } catch (error) {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }
};
