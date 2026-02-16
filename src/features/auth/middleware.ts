import { MiddlewareHandler } from 'hono';
import { jwtVerify, SignJWT } from 'jose';
import { db } from '../../db.js';
import { users } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import argon2 from 'argon2';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-min-32-characters-long');

export type JWTPayload = {
  userId: string;
  username: string;
};

export type Variables = {
  user: JWTPayload;
};

export async function generateToken(userId: string, username: string): Promise<string> {
  const token = await new SignJWT({ userId, username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
  
  return token;
}

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

export async function loginUser(username: string, password: string) {
  const user = await db.select().from(users).where(eq(users.username, username)).limit(1);
  
  if (user.length === 0) {
    throw new Error('Invalid credentials');
  }
  
  const isValidPassword = await argon2.verify(user[0].passwordHash!, password);
  
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }
  
  const token = await generateToken(user[0].id, user[0].username);
  
  return {
    token,
    user: {
      id: user[0].id,
      username: user[0].username,
    },
  };
}
