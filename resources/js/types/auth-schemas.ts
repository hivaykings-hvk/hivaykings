import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const signupFormSchema = z
    .object({
        firstName: z.string().min(1, { message: 'First name is required.' }).trim(),
        lastName: z.string().min(1, { message: 'Last name is required.' }).trim(),
        title: z.string().optional(),
        username: z.string().min(1, { message: 'Username is required.' }).trim(),
        email: z.string().min(1, { message: 'Email is required.' }).trim(),
        phone: z.string().min(1, { message: 'Phone is required.' }).trim(),
        password: z.string().min(1, { message: 'Password is required.' }).trim(),
        confirmPassword: z.string().min(1, { message: 'Confirm password is required.' }).trim(),
        city: z.string().min(1, { message: 'City is required.' }).trim(),
        state: z.string().min(1, { message: 'State is required.' }),
        country: z.string().min(1, { message: 'Country is required.' }).trim(),
        pincode: z.string().min(1, { message: 'Pincode is required.' }).trim(),
        bio: z.string().optional(),
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
