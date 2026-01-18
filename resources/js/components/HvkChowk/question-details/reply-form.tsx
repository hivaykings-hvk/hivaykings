'use client';

import RichTextEditor from '@/Components/RichTextEditor';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { User } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

// Define Zod schema WITHOUT min(1) constraint - let's validate properly
const ReplyFormSchema = z.object({
    content: z
        .string()
        .refine((val) => val && val.trim().length > 0, {
            message: 'Reply content is required',
        })
        .refine((val) => val && val.trim().length >= 3, {
            message: 'Reply must be at least 3 characters long',
        })
        .refine((val) => val && val.length <= 5000, {
            message: 'Reply cannot exceed 5000 characters',
        }),
    questionId: z.string().min(1, 'Question ID is required'),
    parentId: z.string().optional(),
});

const OCI_BUCKET_BASE_URL = import.meta.env.VITE_OCI_BUCKET_BASE_URL || 'https://hvk-chowk.s3.com';

interface ReplyFormProps {
    questionId: string;
    user?: User | null;
    parentId?: string;
    onSubmitSuccess?: () => void;
}

interface Reply {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        title: string;
        image: string;
    };
    childCount: number;
}

export default function ReplyForm({ questionId, user, parentId, onSubmitSuccess }: ReplyFormProps) {
    const queryClient = useQueryClient();
    const replyForm = useForm<z.infer<typeof ReplyFormSchema>>({
        resolver: zodResolver(ReplyFormSchema),
        mode: 'onBlur',
        defaultValues: {
            content: '',
            questionId: String(questionId),
            parentId: parentId ? String(parentId) : undefined,
        },
    });

    // Monitor form state changes
    useEffect(() => {
        const subscription = replyForm.watch(() => {});
        return () => subscription.unsubscribe();
    }, [replyForm]);

    const getCsrfToken = () => {
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        return token || '';
    };

    const submitReplyMutation = useMutation({
        mutationFn: async (values: z.infer<typeof ReplyFormSchema>) => {
            // Validate
            if (!user) {
                throw new Error('You must be logged in to submit a reply');
            }

            const textContent = values.content.replace(/<[^>]*>/g, '').trim();

            if (textContent.length === 0) {
                throw new Error('Reply content cannot be empty');
            }

            if (textContent.length < 3) {
                throw new Error('Reply must be at least 3 characters long');
            }

            if (textContent.length > 5000) {
                throw new Error('Reply cannot exceed 5000 characters');
            }

            const endpoint = parentId ? `/api/replies/${parentId}/child` : '/api/replies';
            const csrfToken = getCsrfToken();
            const payload = {
                content: values.content,
                questionId: values.questionId,
                ...(parentId && { parentId: values.parentId }),
            };

            const response = await axios.post(endpoint, payload, {
                headers: {
                    'X-CSRF-Token': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json',
                },
            });

            return response.data;
        },
        onMutate: async (newReply) => {
            const queryKey = [`/api/questions/${questionId}/replies`];

            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey });

            // Snapshot the previous data
            const previousData = queryClient.getQueryData(queryKey);

            // Optimistically update to the new value
            const newReplyData: Reply = {
                id: String(Math.random()),
                content: newReply.content,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                user: {
                    id: String(user?.id),
                    firstName: user?.firstName || '',
                    lastName: user?.lastName || '',
                    title: user?.title || '',
                    image: user?.image || '',
                },
                childCount: 0,
            };

            queryClient.setQueryData(queryKey, (oldData: any) => ({
                ...oldData,
                data: {
                    ...oldData?.data,
                    replies: [newReplyData, ...(oldData?.data?.replies || [])],
                    total: (oldData?.data?.total || 0) + 1,
                },
            }));

            return { previousData };
        },
        onError: (error: any, variables, context: any) => {
            // Rollback on error
            if (context?.previousData) {
                queryClient.setQueryData([`/api/questions/${questionId}/replies`], context.previousData);
            }

            // Show error toast
            const errorMessage = error.response?.data?.errors
                ? Object.values(error.response.data.errors)[0]
                : error.message || 'Failed to post reply. Please try again.';

            toast.error(String(errorMessage), {
                position: 'top-right',
                duration: 4000,
            });
        },
        onSuccess: () => {
            // Invalidate both parent and nested queries
            queryClient.invalidateQueries({
                queryKey: [`/api/questions/${questionId}/replies`],
            });

            // Also invalidate child replies count if this is a nested reply
            if (parentId) {
                queryClient.invalidateQueries({
                    queryKey: [`/api/replies/${parentId}/children`],
                });
                queryClient.invalidateQueries({
                    queryKey: [`/api/replies/${parentId}/child-count`],
                });
            }

            toast.success('Reply posted successfully!', {
                position: 'top-right',
                duration: 3000,
            });

            // Reset form
            replyForm.reset({
                content: '',
                questionId: String(questionId),
                parentId: parentId ? String(parentId) : undefined,
            });

            // Call the callback if provided
            onSubmitSuccess?.();
        },
    });

    const handleSubmit = async (values: z.infer<typeof ReplyFormSchema>) => {
        submitReplyMutation.mutate(values);
    };

    return (
        <div id="share-your-reply" className="mt-8 rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-md mb-4 font-medium text-gray-800">Share your reply</h2>
            <div className="mb-4 flex w-full flex-col items-start gap-4 sm:flex-row">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={`${OCI_BUCKET_BASE_URL}/${user?.image}`} className="object-cover" />
                    <AvatarFallback>{`${user?.firstName?.[0]}${user?.lastName?.[0]}`}</AvatarFallback>
                </Avatar>
                <div className="flex w-full flex-1 flex-col">
                    <Form {...replyForm}>
                        <form onSubmit={replyForm.handleSubmit(handleSubmit)} className="w-full">
                            <input type="hidden" {...replyForm.register('questionId')} defaultValue={String(questionId)} />
                            {parentId && <input type="hidden" {...replyForm.register('parentId')} defaultValue={String(parentId)} />}
                            <FormField
                                control={replyForm.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <RichTextEditor
                                                content={field.value || ''}
                                                onChange={(value) => {
                                                    field.onChange(value);
                                                }}
                                                menuItems={[
                                                    'paragraph',
                                                    'heading1',
                                                    'heading2',
                                                    'heading3',
                                                    'bold',
                                                    'italic',
                                                    'bulletList',
                                                    'link',
                                                    'blockquote',
                                                ]}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />
                            <div className="flex w-full justify-end">
                                <button
                                    type="submit"
                                    disabled={submitReplyMutation.isPending}
                                    className="text-md mt-6 cursor-pointer rounded-xl bg-primary px-6 py-2 font-semibold text-gray-800 disabled:opacity-50 md:mt-0"
                                >
                                    {submitReplyMutation.isPending ? 'Posting...' : 'Post Reply'}
                                </button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
