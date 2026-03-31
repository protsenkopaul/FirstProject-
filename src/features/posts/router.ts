import { Hono } from 'hono';
import { sValidator } from '@hono/standard-validator';
import { createPost, getFeed, getPostById, updatePost, deletePost, getPostsByUserId } from "./service.js";
import { auth } from "../auth/middleware.js";
import { CreatePostSchema, UpdatePostSchema, PostIdParamSchema, UserIdParamSchema } from "./schemas.js";
import { AuthorIdParamSchema } from "../authors/schemas.js";

const posts = new Hono();

posts.post("/", sValidator('json', CreatePostSchema), async (c) => {
  const params = c.req.valid('json');
  const post = await createPost(params);
  return c.json(post);
});

posts.get("/feed/:authorId", auth, sValidator('param', AuthorIdParamSchema), async (c) => {
  const { authorId } = c.req.valid('param');
  const feed = await getFeed(authorId);
  return c.json(feed);
});

posts.get("/:postId", sValidator('param', PostIdParamSchema), async (c) => {
  const { postId } = c.req.valid('param');
  const post = await getPostById(postId);
  return c.json(post);
});

posts.put("/:postId", auth, sValidator('param', PostIdParamSchema), sValidator('json', UpdatePostSchema), async (c) => {
  const { postId } = c.req.valid('param');
  const user = c.get('user');
  const params = c.req.valid('json');
  const post = await updatePost(postId, user.userId, params);
  return c.json(post);
});

posts.delete("/:postId", auth, sValidator('param', PostIdParamSchema), async (c) => {
  const { postId } = c.req.valid('param');
  const user = c.get('user');
  await deletePost(postId, user.userId);
  return c.json({ success: true });
});

posts.get("/user/:userId", sValidator('param', UserIdParamSchema), async (c) => {
  const { userId } = c.req.valid('param');
  const userPosts = await getPostsByUserId(userId);
  return c.json(userPosts);
});

export default posts;
