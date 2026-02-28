'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { CgSpinner } from 'react-icons/cg';
import { FiAlertCircle, FiSave } from 'react-icons/fi';
import { toast } from 'sonner';
import { z } from 'zod';
import ProfileImageUpload from './profile-image-upload';

interface PersonalInfoMutationContext {
    previousUser: any;
}

const personalInfoSchema = z.object({
    first_name: z.string().min(2, 'First name must be at least 2 characters'),
    last_name: z.string().min(2, 'Last name must be at least 2 characters'),
    username: z.string().min(3, 'Username must be at least 3 characters').optional().or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
    bio: z.string().max(500, 'Bio must be at most 500 characters').optional().or(z.literal('')),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

interface PersonalInfoFormProps {
    user: any;
}

export function PersonalInfoForm({ user }: PersonalInfoFormProps) {
    const queryClient = useQueryClient();
    const [selectedImageFile, setSelectedImageFile] = React.useState<File | null>(null);
    const [isUploadingImage, setIsUploadingImage] = React.useState(false);
    const [isImageChanged, setIsImageChanged] = React.useState(false);

    const form = useForm<PersonalInfoFormData>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            username: user?.username || '',
            phone: user?.phone || '',
            bio: user?.bio || '',
        },
    });

    React.useEffect(() => {
        form.reset({
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            username: user?.username || '',
            phone: user?.phone || '',
            bio: user?.bio || '',
        });
        setSelectedImageFile(null);
        setIsImageChanged(false);
    }, [user.id, form]);

    const uploadImageLaravel = async (file: File): Promise<string | null> => {
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await axios.post('/api/upload-profile-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data.path || response.data.image_path;
        } catch (error: any) {
            console.error('Image upload error:', error);
            toast.error('Failed to upload image');
            return null;
        }
    };

    const updatePersonalInfoMutation = useMutation<any, Error, PersonalInfoFormData, PersonalInfoMutationContext>({
        mutationFn: async (data) => {
            const response = await axios.put('/api/user/profile', {
                first_name: data.first_name,
                last_name: data.last_name,
                username: data.username || undefined,
                phone: data.phone || undefined,
                bio: data.bio || undefined,
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
                    first_name: newData.first_name,
                    last_name: newData.last_name,
                    username: newData.username || old.username,
                    phone: newData.phone || old.phone,
                    bio: newData.bio || old.bio,
                };
            });

            return { previousUser };
        },
        onError: (err, newData, context) => {
            toast.error('Failed to update personal information');
            if (context?.previousUser) {
                queryClient.setQueryData(['user'], context.previousUser);
            }
        },
        onSuccess: () => {
            setIsImageChanged(false);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            toast.success('Personal information updated successfully!');
        },
    });

    const onSubmit = async (data: PersonalInfoFormData) => {
        if (selectedImageFile) {
            setIsUploadingImage(true);
            const uploadedImagePath = await uploadImageLaravel(selectedImageFile);
            setIsUploadingImage(false);

            if (!uploadedImagePath) {
                return;
            }

            // Update user data with image
            try {
                await axios.put('/api/user/profile', {
                    ...data,
                    bio: data.bio || undefined,
                    image_path: uploadedImagePath,
                });
                queryClient.invalidateQueries({ queryKey: ['user'] });
                toast.success('Personal information and image updated successfully!');
                setSelectedImageFile(null);
                setIsImageChanged(false);
            } catch (error: any) {
                toast.error('Failed to update profile with image');
            }
            return;
        }

        updatePersonalInfoMutation.mutate(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                        <FiAlertCircle className="h-5 w-5 text-blue-500" />
                        Personal Information
                    </h3>
                    <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">Update your personal details and profile information</p>
                </div>

                {/* Profile Image - First Field */}
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-700">
                    <div className="w-full">
                        <h4 className="mb-3 text-sm font-medium text-slate-900 dark:text-white">Profile Image</h4>
                        <div className="flex w-fit flex-col items-start gap-4">
                            <div>
                                <ProfileImageUpload
                                    initialImageUrl={'/storage/' + user?.image_path}
                                    onImageChange={(file) => {
                                        setSelectedImageFile(file);
                                        setIsImageChanged(true);
                                    }}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-xs text-slate-500 dark:text-slate-400">Upload or drag your profile picture</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500">Recommended: JPG, PNG or WebP format</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* First Name */}
                    <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    First Name <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="John" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Last Name */}
                    <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Last Name <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Username */}
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="johndoe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Phone */}
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="+1 (555) 123-4567" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Display Current Email (Read-only) */}
                <FormItem>
                    <FormLabel>Email (Read-only)</FormLabel>
                    <FormControl>
                        <Input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full cursor-not-allowed rounded-lg border border-slate-300 bg-slate-100 px-4 py-2 text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        />
                    </FormControl>
                    <FormMessage />
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Your email cannot be changed from here</p>
                </FormItem>

                {/* Bio - About You */}
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>About You (Bio)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell us something about yourself (optional)"
                                    className="flex min-h-[120px] w-full rounded-lg border border-slate-300 bg-slate-100 px-4 py-2 text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                    {...field}
                                />
                            </FormControl>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{field.value?.length || 0}/500 characters</p>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                    <Button
                        type="submit"
                        disabled={(!form.formState.isDirty && !isImageChanged) || updatePersonalInfoMutation.isPending || isUploadingImage}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-medium text-gray-800 transition-colors disabled:cursor-not-allowed disabled:bg-primary/50"
                    >
                        <FiSave className="h-4 w-4" />
                        {isUploadingImage ? 'Uploading image...' : updatePersonalInfoMutation.isPending ? 'Saving...' : 'Save Changes'}
                        {(updatePersonalInfoMutation.isPending || isUploadingImage) && (
                            <CgSpinner className="ml-2 h-5 w-5 animate-spin text-gray-800" />
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
