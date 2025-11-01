import { pool } from "../db.js";

export type Post = {
  id: string;
  authorId: string;
  title: string;
  content: string;
  createdAt: string;
  likes: number;
};

export async function createPost(authorId: string, title: string, content: string): Promise<Post> {
  const res = await pool.query(
    `INSERT INTO posts (title, body, user_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [title, content, authorId]
  );
  const row = res.rows[0];
  return {
    id: row.id,
    authorId: row.user_id || row.userid || row.userId,
    title: row.title,
    content: row.body || row.content,
    createdAt: row.created_at || row.createdAt || row.createdat,
    likes: 0,
  };
}

export async function getFeed(authorId: string): Promise<Post[]> {
  // Find followed user ids
  const followsRes = await pool.query(
    `SELECT followed_user_id FROM follows WHERE following_user_id = $1`,
    [authorId]
  );
  const followed = followsRes.rows.map((r: any) => r.followed_user_id);
  if (followed.length === 0) return [];

  const postsRes = await pool.query(
    `SELECT * FROM posts WHERE user_id = ANY($1::uuid[]) ORDER BY created_at DESC`,
    [followed]
  );

  return postsRes.rows.map((row: any) => ({
    id: row.id,
    authorId: row.user_id || row.userid || row.userId,
    title: row.title,
    content: row.body || row.content,
    createdAt: row.created_at || row.createdAt || row.createdat,
    likes: 0,
  }));
}