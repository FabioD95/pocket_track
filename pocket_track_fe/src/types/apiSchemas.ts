import { z } from 'zod';

// User
export const UserSchema = z.object({
  _id: z.string(),
  email: z.string().email(),
  name: z.string(),
});
export type User = z.infer<typeof UserSchema>;

// Auth
export const AuthResponseSchema = z.object({
  token: z.string(),
  user: UserSchema.optional(),
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// Transactions
export const TransactionSchema = z.object({
  _id: z.string(),
  amount: z.number(),
  date: z.string().date(),
  type: z.enum(['expense', 'income', 'transfer']),
  executedBy: z.string(),
  beneficiary: z.string().optional(),
  category: z.string(),
  tags: z.array(z.string()).optional(),
  description: z.string().optional(),
  isNecessary: z.boolean(),
});
export type Transaction = z.infer<typeof TransactionSchema>;

export const PostTransactionSchema = TransactionSchema.omit({ _id: true });
export type PostTransaction = z.infer<typeof PostTransactionSchema>;

// Categories
export const CategorySchema = z.object({
  _id: z.string(),
  name: z.string(),
});
export type Category = z.infer<typeof CategorySchema>;

export const CategoriesSchema = z.array(CategorySchema);
export type Categories = z.infer<typeof CategoriesSchema>;

export const GetCategorySchema = z.object({
  category: CategorySchema,
  message: z.string(),
});
export type GetCategory = z.infer<typeof GetCategorySchema>;

export const PostCategorySchema = CategorySchema.omit({ _id: true });
export type PostCategory = z.infer<typeof PostCategorySchema>;

export const PostCategoriesSchema = z.array(PostCategorySchema);
export type PostCategories = z.infer<typeof PostCategoriesSchema>;

// Tags
export const TagSchema = z.object({
  _id: z.string(),
  name: z.string(),
});
export type Tag = z.infer<typeof TagSchema>;

export const TagsSchema = z.array(TagSchema);
export type Tags = z.infer<typeof TagsSchema>;

export const GetTagSchema = z.object({
  tag: TagSchema,
  message: z.string(),
});
export type GetTag = z.infer<typeof GetTagSchema>;

export const PostTagSchema = TagSchema.omit({ _id: true });
export type PostTag = z.infer<typeof PostTagSchema>;

export const PostTagsSchema = z.array(PostTagSchema);
export type PostTags = z.infer<typeof PostTagsSchema>;
