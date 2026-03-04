import { z } from "zod";

export const JWTPayloadSchema = z.object({
  userId: z.string().uuid(),
  username: z.string(),
});

export type JWTPayload = z.infer<typeof JWTPayloadSchema>;

export const CreateUserSchema = z.object({
  username: z.string().min(3, 'Username is too short'),
  password: z.string().min(6, 'Password is too short'),
});

export const LoginSchema = z.object({
  username: z.string().min(3, 'Username is too short'),
  password: z.string().min(6, 'Password is too short'),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});
