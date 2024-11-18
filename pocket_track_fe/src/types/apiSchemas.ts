import { z } from 'zod';

export const UserSchema = z.object({
  _id: z.string(),
  email: z.string().email(),
  name: z.string(),
});
export type User = z.infer<typeof UserSchema>;

export const AuthResponseSchema = z.object({
  token: z.string(),
  //   user: UserSchema.optional(),
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
