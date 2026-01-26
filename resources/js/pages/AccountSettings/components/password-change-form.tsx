'use client';
import { Button } from '@/Components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CgSpinner } from 'react-icons/cg';
import { FiEye, FiEyeOff, FiLock, FiSave } from 'react-icons/fi';
import { toast } from 'sonner';
import { z } from 'zod';
const passwordChangeSchema = z
    .object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Password must contain uppercase letter')
            .regex(/[a-z]/, 'Password must contain lowercase letter')
            .regex(/[0-9]/, 'Password must contain number')
            .regex(/[!@#$%^&*]/, 'Password must contain special character'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, { message: "Passwords don't match", path: ['confirmPassword'] });
type PasswordFormData = z.infer<typeof passwordChangeSchema>;
export function PasswordChangeForm() {
    const [showPasswords, setShowPasswords] = useState({ currentPassword: false, newPassword: false, confirmPassword: false });
    const form = useForm<PasswordFormData>({
        resolver: zodResolver(passwordChangeSchema),
        mode: 'onChange',
        defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    });
    const togglePasswordVisibility = (field: 'currentPassword' | 'newPassword' | 'confirmPassword') => {
        setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
    };
    const changePasswordMutation = useMutation<void, Error, PasswordFormData>({
        mutationFn: async (data) => {
            await axios.post('/api/user/change-password', {
                current_password: data.currentPassword,
                new_password: data.newPassword,
                new_password_confirmation: data.confirmPassword,
            });
        },
        onSuccess: () => {
            toast.success('Password changed successfully!');
            form.reset();
            setShowPasswords({ currentPassword: false, newPassword: false, confirmPassword: false });
        },
        onError: (error) => {
            const message = axios.isAxiosError(error) ? error.response?.data?.message || error.message : 'Failed to change password';
            toast.error(message);
            console.error('Password change failed:', error);
        },
    });
    const onSubmit = (data: PasswordFormData) => {
        changePasswordMutation.mutate(data);
    };
    return (
        <Form {...form}>
            {' '}
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-lg space-y-6">
                {' '}
                <div>
                    {' '}
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                        {' '}
                        <FiLock className="h-5 w-5 text-red-500" /> Change Password{' '}
                    </h3>{' '}
                    <p className="mb-6 text-sm text-slate-600 dark:text-slate-400"> Update your password to keep your account secure </p>{' '}
                </div>{' '}
                {/* Security Tips */}{' '}
                <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                    {' '}
                    <h4 className="mb-3 text-sm font-semibold text-amber-900 dark:text-amber-100"> 🔐 Password Requirements </h4>{' '}
                    <ul className="space-y-1 text-sm text-amber-800 dark:text-amber-200">
                        {' '}
                        <li>✓ At least 8 characters</li> <li>✓ At least one uppercase letter (A-Z)</li> <li>✓ At least one lowercase letter (a-z)</li>{' '}
                        <li>✓ At least one number (0-9)</li> <li>✓ At least one special character (!@#$%^&*)</li>{' '}
                    </ul>{' '}
                </div>{' '}
                {/* Current Password */}{' '}
                <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Current Password *</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        placeholder="Enter your current password"
                                        type={showPasswords.currentPassword ? 'text' : 'password'}
                                        {...field}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-0 right-0 h-full px-3 py-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                        onClick={() => togglePasswordVisibility('currentPassword')}
                                    >
                                        {showPasswords.currentPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />{' '}
                {/* New Password */}{' '}
                <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New Password *</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input placeholder="Enter your new password" type={showPasswords.newPassword ? 'text' : 'password'} {...field} />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-0 right-0 h-full px-3 py-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                        onClick={() => togglePasswordVisibility('newPassword')}
                                    >
                                        {showPasswords.newPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Confirm Password */}
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password *</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        placeholder="Confirm your new password"
                                        type={showPasswords.confirmPassword ? 'text' : 'password'}
                                        {...field}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-0 right-0 h-full px-3 py-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                        onClick={() => togglePasswordVisibility('confirmPassword')}
                                    >
                                        {showPasswords.confirmPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                    <Button
                        type="submit"
                        disabled={!form.formState.isValid || changePasswordMutation.isPending}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-medium text-gray-800 transition-colors disabled:cursor-not-allowed disabled:bg-primary/50"
                    >
                        <FiSave className="h-4 w-4" />
                        {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
                        {changePasswordMutation.isPending && <CgSpinner className="ml-2 h-5 w-5 animate-spin text-gray-800" />}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
