import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const signupFormSchema = z
    .object({
        firstName: z.string().min(2, { message: 'First name must be at least 2 characters long.' }).trim(),
        lastName: z.string().min(2, { message: 'Last name must be at least 2 characters long.' }).trim(),
        title: z.string().optional(),
        username: z.string().min(2, { message: 'Username must be at least 2 characters long.' }).trim(),
        email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
        phone: z.string().min(10, { message: 'Phone must be at least 10 characters long.' }).trim(),
        password: z
            .string()
            .min(8, { message: 'Be at least 8 characters long' })
            .regex(/[a-zA-Z]/, { message: 'Must contain at least one letter.' })
            .regex(/[0-9]/, { message: 'Must contain at least one number.' })
            .regex(/[^a-zA-Z0-9]/, {
                message: 'Must contain at least one special character.',
            })
            .trim(),
        confirmPassword: z
            .string()
            .min(8, { message: 'Be at least 8 characters long' })
            .regex(/[a-zA-Z]/, { message: 'Must contain at least one letter.' })
            .regex(/[0-9]/, { message: 'Must contain at least one number.' })
            .regex(/[^a-zA-Z0-9]/, {
                message: 'Must contain at least one special character.',
            })
            .trim(),
        city: z.string().min(2, { message: 'City must be at least 2 characters long.' }).trim(),
        state: z.string().min(2, { message: 'Please select a valid state.' }),
        country: z.string().min(2, { message: 'Country must be at least 2 characters long.' }).trim(),
        pincode: z.string().min(4, { message: 'Pincode must be at least 4 characters long.' }).trim(),
        image: z.any().optional(),
        agreeTerms: z.boolean().refine((val) => val === true, {
            message: 'You must agree to the terms and conditions.',
        }),
        subscribeNewsletter: z.boolean().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Password and confirm password do not match',
        path: ['confirmPassword'],
    });

export const signInFormSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    password: z.string().min(1, { message: 'Password is required.' }),
    rememberMe: z.boolean().optional(),
});

export type SignupFormSchema = z.infer<typeof signupFormSchema>;
export type SignInFormSchema = z.infer<typeof signInFormSchema>;
