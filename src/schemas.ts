import { z } from "zod";

export * from "./features/auth/schemas.js";
export * from "./features/authors/schemas.js";
export * from "./features/posts/schemas.js";

export const IdParamSchema = z.object({
  id: z.string().uuid({ message: "Invalid ID format" }),
});

export const UserIdParamSchema = z.object({
  userId: z.string().uuid({ message: "Invalid userId format" }),
});
