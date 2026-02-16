import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import crypto from 'crypto';

// Postgres pool + Drizzle client
const connectionString = process.env.DATABASE_URL || process.env.PG_CONNECTION || '';
if (!connectionString) {
  console.warn('DATABASE_URL not set — Drizzle will attempt to connect with an empty connection string');
}

export const pool = new Pool({ connectionString });
export const db = drizzle(pool);

// Simple password helpers using scrypt
export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string) {
  try {
    const [salt, key] = stored.split(':');
    const derived = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(key, 'hex'), Buffer.from(derived, 'hex'));
  } catch {
    return false;
  }
}

export default db;
