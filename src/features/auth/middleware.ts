import { MiddlewareHandler } from 'hono';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export type JWTPayload = {
  userId: string;
  username: string;
};

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
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    if (!payload.userId || !payload.username) {
      return c.json({ error: 'Invalid token payload' }, 401);
    }
    
    c.set('user', {
      userId: payload.userId as string,
      username: payload.username as string,
    });
    
    await next();
  } catch (error) {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }
};
