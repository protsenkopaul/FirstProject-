import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createAuthor, followAuthor } from "./models/authorController.js";
import { createPost, getFeed } from "./models/postController.js";
import {
  CreateAuthorSchema,
  FollowAuthorSchema,
  CreatePostSchema,
} from "@./schemas";


const app = new Hono();

app.post("/authors", zValidator('json', CreateAuthorSchema), async (c) => {
  const { name, bio } = await c.req.json();
  const author = await createAuthor(name, bio);
  return c.json(author);
});

app.post("/authors/:id/follow", zValidator('json', FollowAuthorSchema), async (c) => {
  const followerId = c.req.param('id');
  const { targetId } = await c.req.json();
  const result = await followAuthor(followerId, targetId);
  return c.json(result);
});

app.post("/posts", zValidator('json', CreatePostSchema), async (c) => {
  const { authorId, title, content } = await c.req.json();
  const post = await createPost(authorId, title, content);
  return c.json(post);
});

app.get("/feed/:id", async (c) => {
  const authorId = c.req.param('id');
  const feed = await getFeed(authorId);
  return c.json(feed);
});

export default app;


