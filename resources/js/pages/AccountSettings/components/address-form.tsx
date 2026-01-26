'use client';
import { Button } from '@/Components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { CgSpinner } from 'react-icons/cg';
import { FiMapPin, FiSave } from 'react-icons/fi';
import { toast } from 'sonner';
import { z } from 'zod';
interface AddressMutationContext {
    previousUser: any;
}
const addressSchema = z.object({
    city: z.string().optional().or(z.literal('')),
    state: z.string().optional().or(z.literal('')),
    country: z.string().optional().or(z.literal('')),
    pincode: z.string().optional().or(z.literal('')),
});
type AddressFormData = z.infer<typeof addressSchema>;
interface AddressFormProps {
    user: any;
}
export function AddressForm({ user }: AddressFormProps) {
    const queryClient = useQueryClient();
    const form = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: { city: user?.city || '', state: user?.state || '', country: user?.country || '', pincode: user?.pincode || '' },
    });
    React.useEffect(() => {
        form.reset({ city: user?.city || '', state: user?.state || '', country: user?.country || '', pincode: user?.pincode || '' });
    }, [user.id, form]);
    const updateAddressMutation = useMutation<any, Error, AddressFormData, AddressMutationContext>({
        mutationFn: async (data) => {
            const response = await axios.put('/api/user/profile', {
                city: data.city || undefined,
                state: data.state || undefined,
                country: data.country || undefined,
                pincode: data.pincode || undefined,
            });
            return response.data;
        },
        onMutate: async (newData) => {
            await queryClient.cancelQueries({ queryKey: ['user'] });
            const previousUser = queryClient.getQueryData(['user']);
            queryClient.setQueryData(['user'], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    ...newData,
                    city: newData.city || old.city,
                    state: newData.state || old.state,
                    country: newData.country || old.country,
                    pincode: newData.pincode || old.pincode,
                };
            });
            return { previousUser };
        },
        onError: (err, newData, context) => {
            toast.error('Failed to update address');
            if (context?.previousUser) {
                queryClient.setQueryData(['user'], context.previousUser);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            toast.success('Address updated successfully!');
        },
    });
    const onSubmit = (data: AddressFormData) => {
        updateAddressMutation.mutate(data);
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
                        <FiMapPin className="h-5 w-5 text-emerald-500" /> Address Information{' '}
                    </h3>{' '}
                    <p className="mb-6 text-sm text-slate-600 dark:text-slate-400"> Update your address and location details </p>{' '}
                </div>{' '}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {' '}
                    {/* City */}{' '}
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input placeholder="New York" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* State/Province */}
                    <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>State / Province</FormLabel>
                                <FormControl>
                                    <Input placeholder="New York" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Country */}
                    <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                    <Input placeholder="United States" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Pincode */}
                    <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Postal / Zip Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="10001" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                    <Button
                        type="submit"
                        disabled={!form.formState.isDirty || updateAddressMutation.isPending}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-medium text-gray-800 transition-colors disabled:cursor-not-allowed disabled:bg-primary/50"
                    >
                        <FiSave className="h-4 w-4" />
                        {updateAddressMutation.isPending ? 'Saving...' : 'Save Changes'}
                        {updateAddressMutation.isPending && <CgSpinner className="ml-2 h-5 w-5 animate-spin text-gray-800" />}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
