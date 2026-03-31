import { z } from "zod";

export const CreatePostSchema = z.object({
  authorId: z.string().uuid({ message: "Incorrect ID" }),
  title: z.string().min(3, "Title is too short"),
  content: z.string().min(5, "Content is too short"),
});

export const UpdatePostSchema = z.object({
  title: z.string().min(3, "Title is too short").optional(),
  content: z.string().min(5, "Content is too short").optional(),
});

export const PostIdParamSchema = z.object({
  postId: z.string().uuid({ message: "Invalid postId format" }),
});

export const UserIdParamSchema = z.object({
  userId: z.string().uuid({ message: "Invalid userId format" }),
});
