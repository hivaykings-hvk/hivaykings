'use client';
import { Button } from '@/Components/ui/button';
import { Checkbox } from '@/Components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { CgSpinner } from 'react-icons/cg';
import { FiSave, FiSettings } from 'react-icons/fi';
import { toast } from 'sonner';
import { z } from 'zod';
interface PreferencesMutationContext {
    previousUser: any;
}
const preferencesSchema = z.object({ subscribe_newsletter: z.boolean() });
type PreferencesFormData = z.infer<typeof preferencesSchema>;
interface PreferencesFormProps {
    user: any;
}
export function PreferencesForm({ user }: PreferencesFormProps) {
    const queryClient = useQueryClient();
    const form = useForm<PreferencesFormData>({
        resolver: zodResolver(preferencesSchema),
        defaultValues: { subscribe_newsletter: user?.subscribe_newsletter || false },
    });
    const subscribeNewsletter = form.watch('subscribe_newsletter');
    React.useEffect(() => {
        form.reset({ subscribe_newsletter: user?.subscribe_newsletter || false });
    }, [user.id, form]);
    const updatePreferencesMutation = useMutation<any, Error, PreferencesFormData, PreferencesMutationContext>({
        mutationFn: async (data) => {
            const response = await axios.put('/api/user/profile', { subscribe_newsletter: data.subscribe_newsletter });
            return response.data;
        },
        onMutate: async (newData) => {
            await queryClient.cancelQueries({ queryKey: ['user'] });
            const previousUser = queryClient.getQueryData(['user']);
            queryClient.setQueryData(['user'], (old: any) => {
                if (!old) return old;
                return { ...old, ...newData, subscribe_newsletter: newData.subscribe_newsletter };
            });
            return { previousUser };
        },
        onError: (err, newData, context) => {
            toast.error('Failed to update preferences');
            if (context?.previousUser) {
                queryClient.setQueryData(['user'], context.previousUser);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            toast.success('Preferences updated successfully!');
        },
    });
    const onSubmit = (data: PreferencesFormData) => {
        updatePreferencesMutation.mutate(data);
    };
    return (
        <Form {...form}>
            {' '}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {' '}
                <div>
                    {' '}
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                        {' '}
                        <FiSettings className="h-5 w-5 text-purple-500" /> User Preferences{' '}
                    </h3>
                    <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">Manage your communication and notification preferences</p>
                </div>
                <div className="space-y-6">
                    {/* Newsletter Subscription */}
                    <FormField
                        control={form.control}
                        name="subscribe_newsletter"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="mt-1 h-5 w-5 cursor-pointer rounded accent-primary"
                                    />
                                </FormControl>
                                <div className="flex-1">
                                    <FormLabel className="block cursor-pointer text-base font-medium text-slate-900 dark:text-white">
                                        Subscribe to Newsletter
                                    </FormLabel>
                                    <FormMessage />
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        {subscribeNewsletter
                                            ? '✓ You will receive our weekly newsletter with updates and stories'
                                            : 'You will not receive our newsletter'}
                                    </p>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* Information Section */}
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                        <h4 className="mb-2 text-sm font-semibold text-blue-900 dark:text-blue-100">📧 About Our Newsletter</h4>
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            Subscribe to stay updated with the latest road ratings, travel stories, and community updates from HVK.
                        </p>
                    </div>
                </div>
                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                    <Button
                        type="submit"
                        disabled={!form.formState.isDirty || updatePreferencesMutation.isPending}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-medium text-gray-800 transition-colors disabled:cursor-not-allowed disabled:bg-primary/50"
                    >
                        <FiSave className="h-4 w-4" />
                        {updatePreferencesMutation.isPending ? 'Saving...' : 'Save Changes'}
                        {updatePreferencesMutation.isPending && <CgSpinner className="ml-2 h-5 w-5 animate-spin text-gray-800" />}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
