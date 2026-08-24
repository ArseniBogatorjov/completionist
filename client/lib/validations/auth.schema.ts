import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email({ error: 'Invalid email or password' }),
  password: z.string().min(1, { error: 'Invalid email or password' }),
});

export const registerSchema = z
  .object({
    username: z.string().min(1, { error: 'Username required' }),
    email: z.email({ error: 'Invalid email format' }),
    password: z
      .string()
      .min(8, { error: 'Password must be at least 8 characters long' })
      .regex(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        error:
          'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character',
      }),
    passwordConfirm: z
      .string()
      .min(1, { error: 'Please confirm your password' }),
    avatarUrl: z
      .union([z.url({ error: 'Invalid avatar URL format' }), z.literal('')])
      .optional()
      .transform((value) => (value && value.trim() !== '' ? value : null)),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    error: 'Passwords do not match',
    path: ['passwordConfirm'],
  });
