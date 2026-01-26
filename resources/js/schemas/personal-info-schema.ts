import { z } from 'zod';

export const PersonalInfoSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    username: z.string().min(3, 'Username must be at least 3 characters').optional().or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
});

export type PersonalInfoSchemaType = z.infer<typeof PersonalInfoSchema>;
