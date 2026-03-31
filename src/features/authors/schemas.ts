import { z } from "zod";

export const CreateAuthorSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  bio: z.string().optional(),
});

export const FollowAuthorSchema = z.object({
  targetId: z.string().uuid({ message: "Incorrect ID" }),
});

export const UpdateAuthorSchema = z.object({
  name: z.string().min(2, "Name is too short").optional(),
  bio: z.string().optional(),
});

export const AuthorIdParamSchema = z.object({
  authorId: z.string().uuid({ message: "Invalid authorId format" }),
});
