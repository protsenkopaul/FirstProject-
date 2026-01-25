import { Hono } from 'hono';
import { sValidator } from '@hono/standard-validator';
import { createAuthor, followAuthor, hashPassword } from "./models/author-controller.js";
import { createPost, getFeed } from "./models/post-controller.js";
import {
  CreateAuthorSchema,
  FollowAuthorSchema,
  CreatePostSchema,
  CreateUserSchema,
} from "./schemas.js";
import { pool } from "./db.js";


const app = new Hono();

app.post("/authors", sValidator('json', CreateAuthorSchema), async (c) => {
  const { name, bio } = await c.req.json();
  const author = await createAuthor(name, bio);
  return c.json(author);
});

app.post("/authors/:id/follow", sValidator('json', FollowAuthorSchema), async (c) => {
  const followerId = c.req.param('id');
  const { targetId } = await c.req.json();
  const result = await followAuthor(followerId, targetId);
  return c.json(result);
});

app.post("/posts", sValidator('json', CreatePostSchema), async (c) => {
  const { authorId, title, content } = await c.req.json();
  const post = await createPost(authorId, title, content);
  return c.json(post);
});

app.get("/feed/:id", async (c) => {
  const authorId = c.req.param('id');
  const feed = await getFeed(authorId);
  return c.json(feed);
});

app.post('/register', sValidator('json', CreateUserSchema), async (c) => {
  const { username, password } = await c.req.json();
  const ex = await pool.query(`SELECT id FROM users WHERE username = $1`, [username]);
  const existingCount = (ex?.rowCount ?? ex?.rows?.length ?? 0) as number;
  if (existingCount > 0) return c.json({ error: 'Username already exists' }, 400);
  const passwordHash = hashPassword(password);
  const res = await pool.query(
    `INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *`,
    [username, passwordHash]
  );
  const row = res.rows[0];
  const user = { id: row.id, username: row.username, createdAt: row.created_at || row.createdAt };
  return c.json(user, 201);
});

export default app;


