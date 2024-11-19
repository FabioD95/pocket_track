import { z } from 'zod';

// Validazione della data come stringa ISO8601
const DateString = z.string().refine(
  (date) => {
    return !isNaN(Date.parse(date)); // Controlla che la stringa sia una data valida
  },
  {
    message: 'Invalid date format. Use a valid ISO8601 string.',
  }
);

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
  _id: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, { message: 'Invalid ObjectId format.' }),
  amount: z.number().positive({ message: 'Amount must be a positive number.' }),
  date: DateString, // Usa la validazione personalizzata
  type: z.enum(['expense', 'income', 'transfer']),
  executedBy: z.string().min(1, { message: 'ExecutedBy is required.' }),
  beneficiary: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  tags: z.array(z.string().min(1)).nullable().optional(),
  description: z.string().nullable().optional(),
  isNecessary: z.boolean(),
});
export type Transaction = z.infer<typeof TransactionSchema>;

export const GetTransactionSchema = z.object({
  transaction: TransactionSchema,
  message: z.string().min(1, { message: 'Message cannot be empty.' }),
});
export type GetTransaction = z.infer<typeof GetTransactionSchema>;

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
