import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { sValidator } from '@hono/standard-validator';
import { createAuthor, followAuthor, getAuthorById, updateAuthor } from "./service.js";
import { auth } from "../auth/middleware.js";
import { CreateAuthorSchema, FollowAuthorSchema, UpdateAuthorSchema, AuthorIdParamSchema } from "./schemas.js";

const authors = new Hono();

authors.post("/", auth, sValidator('json', CreateAuthorSchema), async (c) => {
  const params = c.req.valid('json');
  const author = await createAuthor(params);
  return c.json(author);
});

authors.post("/:authorId/follow", auth, sValidator('param', AuthorIdParamSchema), sValidator('json', FollowAuthorSchema), async (c) => {
  const { authorId } = c.req.valid('param');
  const params = c.req.valid('json');
  const result = await followAuthor({ followerId: authorId, targetId: params.targetId });
  return c.json(result);
});

authors.get("/:authorId", sValidator('param', AuthorIdParamSchema), async (c) => {
  const { authorId } = c.req.valid('param');
  const author = await getAuthorById(authorId);
  return c.json(author);
});

authors.put("/:authorId", auth, sValidator('param', AuthorIdParamSchema), sValidator('json', UpdateAuthorSchema), async (c) => {
  const { authorId } = c.req.valid('param');
  const user = c.get('user');
  if (user.userId !== authorId) {
    throw new HTTPException(403, { message: 'Unauthorized' });
  }
  const params = c.req.valid('json');
  const author = await updateAuthor(authorId, params);
  return c.json(author);
});

export default authors;
