import { Hono } from 'hono';
import { sValidator } from '@hono/standard-validator';
import { createAuthor, followAuthor } from "./features/authors/service.js";
import { createPost, getFeed } from "./features/posts/service.js";
import { registerUser } from "./features/auth/service.js";
import {
  CreateAuthorSchema,
  FollowAuthorSchema,
  CreatePostSchema,
  CreateUserSchema,
} from "./schemas.js";


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
  try {
    const user = await registerUser(username, password);
    return c.json(user, 201);
  } catch (error) {
    return c.json({ error: 'Username already exists' }, 400);
  }
});

export default app;


