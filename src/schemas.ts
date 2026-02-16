import { z } from "zod";

export const CreateAuthorSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  bio: z.string().optional(),
});

export const FollowAuthorSchema = z.object({
  targetId: z.string().uuid({ message: "Incorrect ID" }),
});

export const CreatePostSchema = z.object({
  authorId: z.string().uuid({ message: "Incorrect ID" }),
  title: z.string().min(3, "Title is too short"),
  content: z.string().min(5, "Content is too short"),
});

export const CreateUserSchema = z.object({
  username: z.string().min(3, 'Username is too short'),
  password: z.string().min(6, 'Password is too short'),
});

export const LoginSchema = z.object({
  username: z.string().min(3, 'Username is too short'),
  password: z.string().min(6, 'Password is too short'),
});