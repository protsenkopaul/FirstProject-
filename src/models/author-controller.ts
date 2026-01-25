import { pool } from "../db.js";
import argon2 from 'argon2'

type UserRow = {
  id: string;
  username?: string;
  name?: string;
  bio?: string | null;
  createdAt?: Date;
};

const normalizeUserRow = (row: UserRow) => ({
  id: row.id,
  name: row.username || row.name,
  bio: row.bio,
  createdAt: row.createdAt,
  following: [] as string[],
});

export async function createAuthor(name: string, bio?: string) {
  const res = await pool.query(
    `INSERT INTO users (username, bio)
     VALUES ($1, $2)
     RETURNING *`,
    [name, bio]
  );
  const row = res.rows[0];
  return normalizeUserRow(row);
}

export function hashPassword(password: string) {
    return argon2.hash(password, {
    type: argon2.argon2id
  })
}

export async function followAuthor(followerId: string, targetId: string) {
  const followerRes = await pool.query(`SELECT id FROM users WHERE id = $1`, [followerId]);
  if (followerRes.rowCount === 0) throw new Error('Follower not found');
  const targetRes = await pool.query(`SELECT id FROM users WHERE id = $1`, [targetId]);
  if (targetRes.rowCount === 0) throw new Error('Target not found');

  const exists = await pool.query(
    `SELECT id FROM follows WHERE following_user_id = $1 AND followed_user_id = $2`,
    [followerId, targetId]
  );
  if (exists.rowCount === 0) {
    await pool.query(
      `INSERT INTO follows (following_user_id, followed_user_id) VALUES ($1, $2)`,
      [followerId, targetId]
    );
  }

  const following = await pool.query(
    `SELECT followed_user_id FROM follows WHERE following_user_id = $1`,
    [followerId]
  );

  return {
    id: followerId,
    following: following.rows.map(r => r.followed_user_id),
  };
}