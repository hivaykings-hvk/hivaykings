import { z } from 'zod';

export const CreatePollFormSchema = z.object({
    pollQuestion: z.string().min(1, 'Poll question is required').min(5, 'Poll question must be at least 5 characters'),
    pollOptions: z
        .array(
            z.object({
                value: z.string().min(1, 'Option text is required'),
            }),
        )
        .min(2, 'At least 2 options are required')
        .max(4, 'Maximum 4 options allowed'),
    pollDuration: z.enum(['1_day', '3_days', '7_days']),
    tags: z.string().optional(),
    description: z.string().optional(),
});

export type CreatePollFormSchemaType = z.infer<typeof CreatePollFormSchema>;
