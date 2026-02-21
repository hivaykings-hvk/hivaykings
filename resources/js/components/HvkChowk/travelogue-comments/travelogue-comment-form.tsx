'use client';

import RichTextEditor from '@/Components/RichTextEditor';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import UserAvatar from '@/Components/UserAvatar';
import { User } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

// Define Zod schema
const TravelogueCommentFormSchema = z.object({
    content: z
        .string()
        .refine((val) => val && val.trim().length > 0, {
            message: 'Comment content is required',
        })
        .refine((val) => val && val.trim().length >= 3, {
            message: 'Comment must be at least 3 characters long',
        })
        .refine((val) => val && val.length <= 5000, {
            message: 'Comment cannot exceed 5000 characters',
        }),
    travelogueId: z.string().min(1, 'Travelogue ID is required'),
    parentId: z.string().optional(),
});

interface TravelogueCommentFormProps {
    travelogueId: string;
    user: User;
    parentId?: string;
    onSuccess?: () => void;
}

interface Comment {
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

export default function TravelogueCommentForm({ travelogueId, user, parentId, onSuccess }: TravelogueCommentFormProps) {
    const queryClient = useQueryClient();
    const commentForm = useForm<z.infer<typeof TravelogueCommentFormSchema>>({
        resolver: zodResolver(TravelogueCommentFormSchema),
        mode: 'onBlur',
        defaultValues: {
            content: '',
            travelogueId: String(travelogueId),
            parentId: parentId ? String(parentId) : undefined,
        },
    });

    // Monitor form state changes
    useEffect(() => {
        const subscription = commentForm.watch(() => {});
        return () => subscription.unsubscribe();
    }, [commentForm]);

    const getCsrfToken = () => {
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        return token || '';
    };

    const submitCommentMutation = useMutation({
        mutationFn: async (values: z.infer<typeof TravelogueCommentFormSchema>) => {
            // Validate
            if (!user) {
                throw new Error('You must be logged in to submit a comment');
            }

            const textContent = values.content.replace(/<[^>]*>/g, '').trim();

            if (textContent.length === 0) {
                throw new Error('Comment content cannot be empty');
            }

            if (textContent.length < 3) {
                throw new Error('Comment must be at least 3 characters long');
            }

            if (textContent.length > 5000) {
                throw new Error('Comment cannot exceed 5000 characters');
            }

            const endpoint = parentId ? `/api/travelogue-comments/${parentId}/child` : '/api/travelogue-comments';
            const csrfToken = getCsrfToken();
            const payload = {
                content: values.content,
                travelogue_id: values.travelogueId,
                ...(parentId && { parentId: values.parentId }),
            };

            const response = await axios.post(endpoint, payload, {
                headers: {
                    'X-CSRF-Token': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json',
                },
            });

            return response.data.data;
        },
        onMutate: async (newComment) => {
            const queryKey = parentId ? ['travelogue-comments', parentId, 'children'] : ['travelogue-comments', travelogueId];

            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey });

            // Snapshot the previous data
            const previousData = queryClient.getQueryData(queryKey);

            // Optimistically update to the new value
            const newCommentData: Comment = {
                id: String(Math.random()),
                content: newComment.content,
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

            if (parentId) {
                // For nested comments
                queryClient.setQueryData(queryKey, (oldData: any) => {
                    return oldData ? [newCommentData, ...oldData] : [newCommentData];
                });
            } else {
                // For top-level comments
                queryClient.setQueryData(queryKey, (oldData: any) => {
                    return oldData ? [newCommentData, ...oldData] : [newCommentData];
                });
            }

            return { previousData };
        },
        onError: (error: any, variables, context: any) => {
            // Rollback on error
            if (context?.previousData) {
                const queryKey = parentId ? ['travelogue-comments', parentId, 'children'] : ['travelogue-comments', travelogueId];
                queryClient.setQueryData(queryKey, context.previousData);
            }

            // Show error toast
            const errorMessage = error.response?.data?.errors
                ? Object.values(error.response.data.errors)[0]
                : error.message || 'Failed to post comment. Please try again.';

            toast.error(String(errorMessage), {
                position: 'top-right',
                duration: 4000,
            });
        },
        onSuccess: () => {
            // Invalidate both parent and nested queries
            if (parentId) {
                queryClient.invalidateQueries({
                    queryKey: ['travelogue-comments', parentId, 'children'],
                });
                queryClient.invalidateQueries({
                    queryKey: ['travelogue-comments', parentId, 'child-count'],
                });
            } else {
                queryClient.invalidateQueries({
                    queryKey: ['travelogue-comments', travelogueId],
                });
            }

            toast.success('Comment posted successfully!', {
                position: 'top-right',
                duration: 3000,
            });

            // Reset form
            commentForm.reset({
                content: '',
                travelogueId: String(travelogueId),
                parentId: parentId ? String(parentId) : undefined,
            });

            // Call the callback if provided
            onSuccess?.();
        },
    });

    const handleSubmit = async (values: z.infer<typeof TravelogueCommentFormSchema>) => {
        submitCommentMutation.mutate(values);
    };

    return (
        <div id="share-your-comment" className="mt-8 rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-md mb-4 font-medium text-gray-800">Share your experience</h2>
            <div className="mb-4 flex w-full flex-col items-start gap-4 sm:flex-row">
                <UserAvatar imageUrl={user?.image} firstName={user?.firstName} lastName={user?.lastName} />
                <div className="flex w-full flex-1 flex-col">
                    <Form {...commentForm}>
                        <form onSubmit={commentForm.handleSubmit(handleSubmit)} className="w-full">
                            <input type="hidden" {...commentForm.register('travelogueId')} defaultValue={String(travelogueId)} />
                            {parentId && <input type="hidden" {...commentForm.register('parentId')} defaultValue={String(parentId)} />}
                            <FormField
                                control={commentForm.control}
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
                                    disabled={submitCommentMutation.isPending}
                                    className="text-md mt-6 cursor-pointer rounded-xl bg-primary px-6 py-2 font-semibold text-gray-800 disabled:opacity-50 md:mt-0"
                                >
                                    {submitCommentMutation.isPending ? 'Posting...' : parentId ? 'Post Reply' : 'Post Comment'}
                                </button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
