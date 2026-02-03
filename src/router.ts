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
import { db } from "./db.js";
import { users } from "./db/schema.js";
import { eq } from "drizzle-orm";


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
  const existingUsers = await db.select({ id: users.id }).from(users).where(eq(users.username, username));
  if (existingUsers.length > 0) return c.json({ error: 'Username already exists' }, 400);
  const passwordHash = await hashPassword(password);
  const insertedUsers = await db.insert(users).values({ username, passwordHash }).returning();
  const user = insertedUsers[0];
  return c.json({ id: user.id, username: user.username, createdAt: user.createdAt }, 201);
});

export default app;


