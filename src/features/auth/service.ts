import { db } from "../../db.js";
import { users, refreshTokens } from "../../db/schema.js";
import { eq, and, gt, isNull } from "drizzle-orm";
import argon2 from 'argon2'
import { SignJWT, jwtVerify } from 'jose';
import { z } from "zod";
import { JWTPayload, JWTPayloadSchema, CreateUserSchema, LoginSchema, RefreshTokenSchema } from "./schemas.js";
import { sendWelcomeEmail } from "../../services/email.js";
import { HTTPException } from 'hono/http-exception';

export function hashPassword(password: string) {
    return argon2.hash(password, {
    type: argon2.argon2id
  })
}

export async function registerUser(params: z.infer<typeof CreateUserSchema>) {
  return await db.transaction(async (tx) => {
    const existingUsers = await tx.select({ userId: users.userId }).from(users).where(eq(users.username, params.username));
    if (existingUsers.length > 0) {
      throw new HTTPException(400, { message: 'Username already exists' });
    }

    const existingEmails = await tx.select({ userId: users.userId }).from(users).where(eq(users.email, params.email));
    if (existingEmails.length > 0) {
      throw new HTTPException(400, { message: 'Email already exists' });
    }

    const passwordHash = await hashPassword(params.password);
    const insertedUsers = await tx.insert(users).values({ username: params.username, email: params.email, passwordHash }).returning();
    const user = insertedUsers[0];

    sendWelcomeEmail(params.email, params.username).catch(err => {
      console.error('Email sending failed:', err);
    });

    return { id: user.userId, username: user.username, email: user.email, createdAt: user.createdAt };
  });
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function generateToken(userId: string, username: string): Promise<string> {
  const token = await new SignJWT({ userId, username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
  
  return token;
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return JWTPayloadSchema.parse(payload);
}

export async function generateRefreshToken(userId: string): Promise<string> {
  const token = await new SignJWT({ userId, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await db.insert(refreshTokens).values({
    userId,
    token,
    expiresAt,
  });

  return token;
}

export async function verifyRefreshToken(token: string): Promise<string | null> {
  const validTokens = await db
    .select()
    .from(refreshTokens)
    .where(
      and(
        eq(refreshTokens.token, token),
        isNull(refreshTokens.revokedAt),
        gt(refreshTokens.expiresAt, new Date())
      )
    )
    .limit(1);

  if (validTokens.length === 0) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.userId as string;
  } catch {
    return null;
  }
}

export async function revokeRefreshToken(token: string): Promise<void> {
  await db
    .update(refreshTokens)
    .set({ revokedAt: new Date() })
    .where(eq(refreshTokens.token, token));
}

export async function refreshAccessToken(params: z.infer<typeof RefreshTokenSchema>) {
  const userId = await verifyRefreshToken(params.refreshToken);
  
  if (!userId) {
    throw new HTTPException(401, { message: 'Invalid or expired refresh token' });
  }

  const user = await db.select().from(users).where(eq(users.userId, userId)).limit(1);
  
  if (user.length === 0) {
    throw new HTTPException(404, { message: 'User not found' });
  }

  await revokeRefreshToken(params.refreshToken);

  const newAccessToken = await generateToken(user[0].userId, user[0].username);
  const newRefreshToken = await generateRefreshToken(user[0].userId);

  return {
    token: newAccessToken,
    refreshToken: newRefreshToken,
    user: {
      id: user[0].userId,
      username: user[0].username,
    },
  };
}

export async function loginUser(params: z.infer<typeof LoginSchema>) {
  const user = await db.select().from(users).where(eq(users.username, params.username)).limit(1);
  
  if (user.length === 0) {
    throw new HTTPException(401, { message: 'Invalid credentials' });
  }
  
  const isValidPassword = await argon2.verify(user[0].passwordHash!, params.password);
  
  if (!isValidPassword) {
    throw new HTTPException(401, { message: 'Invalid credentials' });
  }
  
  const token = await generateToken(user[0].userId, user[0].username);
  const refreshToken = await generateRefreshToken(user[0].userId);
  
  return {
    token,
    refreshToken,
    user: {
      id: user[0].userId,
      username: user[0].username,
    },
  };
}
