import { Hono } from 'hono';
import { sValidator } from '@hono/standard-validator';
import { createAuthor, followAuthor, getAuthorById, updateAuthor } from "./features/authors/service.js";
import { createPost, getFeed, getPostById, updatePost, deletePost, getPostsByUserId } from "./features/posts/service.js";
import { registerUser, loginUser, refreshAccessToken } from "./features/auth/service.js";
import { authMiddleware } from "./features/auth/middleware.js";
import {
  CreateAuthorSchema,
  FollowAuthorSchema,
  CreatePostSchema,
  CreateUserSchema,
  LoginSchema,
  RefreshTokenSchema,
  UpdatePostSchema,
  UpdateAuthorSchema,
} from "./schemas.js";


const app = new Hono();

app.post("/authors", authMiddleware, sValidator('json', CreateAuthorSchema), async (c) => {
  const { name, bio } = await c.req.json();
  const author = await createAuthor(name, bio);
  return c.json(author);
});

app.post("/authors/:id/follow", authMiddleware, sValidator('json', FollowAuthorSchema), async (c) => {
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

app.get("/feed/:id", authMiddleware, async (c) => {
  const authorId = c.req.param('id');
  const feed = await getFeed(authorId);
  return c.json(feed);
});

app.get("/posts/:id", async (c) => {
  const id = c.req.param('id');
  const post = await getPostById(id);
  if (!post) return c.json({ error: 'Post not found' }, 404);
  return c.json(post);
});

app.put("/posts/:id", authMiddleware, sValidator('json', UpdatePostSchema), async (c) => {
  const id = c.req.param('id');
  const user = c.get('user');
  const { title, content } = await c.req.json();
  const post = await updatePost(id, user.userId, title, content);
  if (!post) return c.json({ error: 'Post not found or unauthorized' }, 403);
  return c.json(post);
});

app.delete("/posts/:id", authMiddleware, async (c) => {
  const id = c.req.param('id');
  const user = c.get('user');
  const deleted = await deletePost(id, user.userId);
  if (!deleted) return c.json({ error: 'Post not found or unauthorized' }, 403);
  return c.json({ success: true });
});

app.get("/posts/user/:userId", async (c) => {
  const userId = c.req.param('userId');
  const posts = await getPostsByUserId(userId);
  return c.json(posts);
});

app.get("/authors/:id", async (c) => {
  const id = c.req.param('id');
  const author = await getAuthorById(id);
  if (!author) return c.json({ error: 'Author not found' }, 404);
  return c.json(author);
});

app.put("/authors/:id", authMiddleware, sValidator('json', UpdateAuthorSchema), async (c) => {
  const id = c.req.param('id');
  const user = c.get('user');
  if (user.userId !== id) return c.json({ error: 'Unauthorized' }, 403);
  const { name, bio } = await c.req.json();
  const author = await updateAuthor(id, name, bio);
  if (!author) return c.json({ error: 'Author not found' }, 404);
  return c.json(author);
});

app.post('/register', sValidator('json', CreateUserSchema), async (c) => {
  const { username, password } = await c.req.json();
  try {
    const user = await registerUser(username, password);
    return c.json(user, 201);
  } catch (error) {
    return c.json({ error: 'Username already exists' }, 400);
  }
});

app.post('/login', sValidator('json', LoginSchema), async (c) => {
  const { username, password } = await c.req.json();
  try {
    const result = await loginUser(username, password);
    return c.json(result);
  } catch (error) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }
});

app.post('/refresh', sValidator('json', RefreshTokenSchema), async (c) => {
  const { refreshToken } = await c.req.json();
  try {
    const result = await refreshAccessToken(refreshToken);
    return c.json(result);
  } catch (error) {
    return c.json({ error: 'Invalid or expired refresh token' }, 401);
  }
});


