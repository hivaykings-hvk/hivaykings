'use client';

import Link from '@/Components/Link';
import { Button } from '@/Components/ui/button';
import { Checkbox } from '@/Components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import { signInFormSchema, SignInFormSchema } from '@/types/auth-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CgSpinner } from 'react-icons/cg';
import { FaEnvelope, FaLock, FaRegEye, FaRegEyeSlash, FaRoad, FaRoute, FaStar, FaUsers } from 'react-icons/fa6';

interface SignInPageProps {
    redirectUrl?: string;
}

export default function SignIn({ redirectUrl = '/' }: SignInPageProps) {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const form = useForm<SignInFormSchema>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
    });

    async function onSubmit(values: SignInFormSchema) {
        setLoading(true);
        setErrorMessage('');
        try {
            const response = await axios.post('/auth/login', {
                email: values.email,
                password: values.password,
                rememberMe: values.rememberMe,
            });

            if (response.status === 200) {
                window.location.href = redirectUrl || '/';
            }
        } catch (error: any) {
            const errorData = error.response?.data;
            setErrorMessage(errorData?.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-2xl">
                {/* Header Section */}
                <div className="-mx-10 -mt-10 mb-8 rounded-t-xl bg-primary p-6 text-center">
                    <div className="inline-block rounded-lg bg-bgGray px-4 py-2 text-lg font-bold text-white">HVK</div>
                    <p className="mt-4 text-sm text-gray-800">Welcome Back, Road Warrior!</p>
                </div>

                {/* Sign In Form */}
                <div>
                    <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">Sign In to Your Journey</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">Continue your adventures with the HVK community</p>
                </div>

                {errorMessage && <div className="rounded-md bg-red-50 p-3 text-center text-sm text-red-600">{errorMessage}</div>}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
                        {/* Email Input */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <div className="mb-1 flex items-center gap-2">
                                            <FaEnvelope className="text-primary" />
                                            <span className="text-sm">Email address</span>
                                        </div>
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="your.email@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password Input */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <div className="mb-1 flex items-center gap-2">
                                            <FaLock className="text-primary" />
                                            <span className="text-sm">Password</span>
                                        </div>
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" {...field} />
                                            <div
                                                className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                <span className="text-gray-400">{showPassword ? <FaRegEyeSlash /> : <FaRegEye />}</span>
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <FormField
                                control={form.control}
                                name="rememberMe"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} id="remember-me" />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel htmlFor="remember-me" className="text-sm font-normal text-gray-900">
                                                Remember Me
                                            </FormLabel>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <div className="text-sm">
                                <a href="#" className="font-medium text-primary underline hover:underline-offset-4">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        {/* Start Your Journey Button */}
                        <Button
                            type="submit"
                            className="group relative flex w-full cursor-pointer items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-gray-800"
                            disabled={loading}
                        >
                            <span className="flex items-center pl-3">
                                <FaRoad className="h-5 w-5 text-gray-800" />
                            </span>
                            <span className="text-md ml-2 font-semibold">{loading ? 'Signing In...' : 'Start Your Journey'}</span>
                            <span className="flex items-center pl-3">{loading && <CgSpinner className="h-5 w-5 animate-spin text-gray-800" />}</span>
                        </Button>
                    </form>
                </Form>

                {/* Or continue with */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                    </div>
                </div>

                {/* Social Sign In Buttons */}
                <div className="mt-6 flex gap-3">
                    <a
                        href="/auth/google"
                        className="flex flex-1 items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:cursor-pointer hover:bg-gray-50"
                    >
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Google
                    </a>
                    <a
                        href="/auth/facebook"
                        className="flex flex-1 items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:cursor-pointer hover:bg-gray-50"
                    >
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                                fill="#1877F2"
                            />
                        </svg>
                        Facebook
                    </a>
                </div>

                {/* New to HiVayKings */}
                <div className="mt-6 text-center text-sm">
                    New to HiVayKings?{' '}
                    <Link href="/auth/signup" className="font-medium text-primary underline hover:underline-offset-4">
                        Join the Brotherhood
                    </Link>
                </div>
            </div>

            {/* Footer Stats */}
            <div className="flex items-center justify-around space-x-3 pt-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                    <FaUsers className="h-5 w-5 text-primary" />
                    <span className="text-sm">12,500+ Members</span>
                </div>
                <div className="flex items-center gap-1">
                    <FaRoute className="h-4 w-4 text-primary" />
                    <span className="text-sm">850+ Routes</span>
                </div>
                <div className="flex items-center gap-1">
                    <FaStar className="h-4 w-4 text-primary" />
                    <span className="text-sm">4.8/5 Rating</span>
                </div>
            </div>
        </div>
    );
}
