import { Hono } from 'hono';
import { sValidator } from '@hono/standard-validator';
import { createAuthor, followAuthor, getAuthorById, updateAuthor } from "./features/authors/service.js";
import { createPost, getFeed, getPostById, updatePost, deletePost, getPostsByUserId } from "./features/posts/service.js";
import { registerUser, loginUser, refreshAccessToken } from "./features/auth/service.js";
import { auth } from "./features/auth/middleware.js";
import { CreateUserSchema, LoginSchema, RefreshTokenSchema } from "./features/auth/schemas.js";
import { CreateAuthorSchema, FollowAuthorSchema, UpdateAuthorSchema, AuthorIdParamSchema } from "./features/authors/schemas.js";
import { CreatePostSchema, UpdatePostSchema, PostIdParamSchema, UserIdParamSchema } from "./features/posts/schemas.js";


const app = new Hono();

app.post("/authors", auth, sValidator('json', CreateAuthorSchema), async (c) => {
  const params = c.req.valid('json');
  const author = await createAuthor(params);
  return c.json(author);
});

app.post("/authors/:authorId/follow", auth, sValidator('param', AuthorIdParamSchema), sValidator('json', FollowAuthorSchema), async (c) => {
  const { authorId } = c.req.valid('param');
  const params = c.req.valid('json');
  const result = await followAuthor({ followerId: authorId, targetId: params.targetId });
  return c.json(result);
});

app.post("/posts", sValidator('json', CreatePostSchema), async (c) => {
  const params = c.req.valid('json');
  const post = await createPost(params);
  return c.json(post);
});

app.get("/feed/:authorId", auth, sValidator('param', AuthorIdParamSchema), async (c) => {
  const { authorId } = c.req.valid('param');
  const feed = await getFeed(authorId);
  return c.json(feed);
});

app.get("/posts/:postId", sValidator('param', PostIdParamSchema), async (c) => {
  const { postId } = c.req.valid('param');
  const post = await getPostById(postId);
  if (!post) return c.json({ error: 'Post not found' }, 404);
  return c.json(post);
});

app.put("/posts/:postId", auth, sValidator('param', PostIdParamSchema), sValidator('json', UpdatePostSchema), async (c) => {
  const { postId } = c.req.valid('param');
  const user = c.get('user');
  const params = c.req.valid('json');
  const result = await updatePost(postId, user.userId, params);
  return c.json(result);
});

app.delete("/posts/:postId", auth, sValidator('param', PostIdParamSchema), async (c) => {
  const { postId } = c.req.valid('param');
  const user = c.get('user');
  await deletePost(postId, user.userId);
  return c.json({ success: true });
});

app.get("/posts/user/:userId", sValidator('param', UserIdParamSchema), async (c) => {
  const { userId } = c.req.valid('param');
  const posts = await getPostsByUserId(userId);
  return c.json(posts);
});

app.get("/authors/:authorId", sValidator('param', AuthorIdParamSchema), async (c) => {
  const { authorId } = c.req.valid('param');
  const author = await getAuthorById(authorId);
  if (!author) return c.json({ error: 'Author not found' }, 404);
  return c.json(author);
});

app.put("/authors/:authorId", auth, sValidator('param', AuthorIdParamSchema), sValidator('json', UpdateAuthorSchema), async (c) => {
  const { authorId } = c.req.valid('param');
  const user = c.get('user');
  if (user.userId !== authorId) return c.json({ error: 'Unauthorized' }, 403);
  const params = c.req.valid('json');
  const author = await updateAuthor(authorId, params);
  if (!author) return c.json({ error: 'Author not found' }, 404);
  return c.json(author);
});

app.post('/register', sValidator('json', CreateUserSchema), async (c) => {
  const params = c.req.valid('json');
  try {
    const user = await registerUser(params);
    return c.json(user, 201);
  } catch (error) {
    return c.json({ error: 'Username already exists' }, 400);
  }
});

app.post('/login', sValidator('json', LoginSchema), async (c) => {
  const params = c.req.valid('json');
  try {
    const result = await loginUser(params);
    return c.json(result);
  } catch (error) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }
});

app.post('/refresh', sValidator('json', RefreshTokenSchema), async (c) => {
  const params = c.req.valid('json');
  try {
    const result = await refreshAccessToken(params);
    return c.json(result);
  } catch (error) {
    return c.json({ error: 'Invalid or expired refresh token' }, 401);
  }
});
