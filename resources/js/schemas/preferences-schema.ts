import { z } from 'zod';

export const PreferencesSchema = z.object({
    subscribe_newsletter: z.boolean().default(false),
});

export type PreferencesSchemaType = z.infer<typeof PreferencesSchema>;
