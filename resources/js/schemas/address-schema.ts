import { z } from 'zod';

export const AddressSchema = z.object({
    city: z.string().optional().or(z.literal('')),
    state: z.string().optional().or(z.literal('')),
    country: z.string().optional().or(z.literal('')),
    pincode: z.string().optional().or(z.literal('')),
});

export type AddressSchemaType = z.infer<typeof AddressSchema>;
