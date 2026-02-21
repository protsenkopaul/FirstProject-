import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.warn('DATABASE_URL not set — Drizzle will attempt to connect with an empty connection string');
}

export const pool = new Pool({ connectionString });
export const db = drizzle(pool);

export default db;
