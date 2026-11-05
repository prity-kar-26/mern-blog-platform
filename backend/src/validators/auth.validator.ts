import { z } from 'zod';

const email = z.string().trim().toLowerCase().email('Invalid email address').max(254);

// bcrypt ignores everything after 72 bytes, so longer passwords are rejected
const password = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be at most 72 characters')
    .regex(/[A-Za-z]/, 'Password must contain at least one letter')
    .regex(/\d/, 'Password must contain at least one number');

export const registerSchema = z.object({
    body: z.object({
        name: z.string().trim().min(2, 'Name must be at least 2 characters').max(50),
        email,
        password,
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email,
        password: z.string().min(1, 'Password is required'),
    }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];