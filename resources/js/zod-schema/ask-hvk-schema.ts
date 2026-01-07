import { z } from 'zod';

export const AskHvkFormSchema = z.object({
    fromCity: z.string().min(1, 'From city is required'),
    toCity: z.string().min(1, 'To city is required'),
    subject: z.string().min(1, 'Subject is required').min(5, 'Subject must be at least 5 characters'),
    description: z.string().min(1, 'Description is required').min(10, 'Description must be at least 10 characters'),
    hashtags: z.string().optional(),
});

export type AskHvkFormSchemaType = z.infer<typeof AskHvkFormSchema>;
