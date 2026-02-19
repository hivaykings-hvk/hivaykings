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

const ReviewFormSchema = z.object({
    content: z
        .string()
        .refine((val) => val && val.trim().length > 0, {
            message: 'Comment is required',
        })
        .refine((val) => val && val.trim().length >= 3, {
            message: 'Comment must be at least 3 characters long',
        })
        .refine((val) => val && val.length <= 5000, {
            message: 'Comment cannot exceed 5000 characters',
        }),
    roadRatingId: z.string().min(1, 'Road rating ID is required'),
    parentId: z.string().optional(),
});

interface ReviewFormProps {
    roadRatingId: string;
    user?: User | null;
    parentId?: string;
    onSubmitSuccess?: () => void;
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

export default function ReviewForm({ roadRatingId, user, parentId, onSubmitSuccess }: ReviewFormProps) {
    const queryClient = useQueryClient();
    const reviewForm = useForm<z.infer<typeof ReviewFormSchema>>({
        resolver: zodResolver(ReviewFormSchema),
        mode: 'onBlur',
        defaultValues: {
            content: '',
            roadRatingId: String(roadRatingId),
            parentId: parentId ? String(parentId) : undefined,
        },
    });

    useEffect(() => {
        const subscription = reviewForm.watch(() => {});
        return () => subscription.unsubscribe();
    }, [reviewForm]);

    const getCsrfToken = () => {
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        return token || '';
    };

    const submitReviewMutation = useMutation({
        mutationFn: async (values: z.infer<typeof ReviewFormSchema>) => {
            if (!user) {
                throw new Error('You must be logged in to submit a comment');
            }

            const textContent = values.content.replace(/<[^>]*>/g, '').trim();

            if (textContent.length === 0) {
                throw new Error('Comment cannot be empty');
            }

            if (textContent.length < 3) {
                throw new Error('Comment must be at least 3 characters long');
            }

            if (textContent.length > 5000) {
                throw new Error('Comment cannot exceed 5000 characters');
            }

            const endpoint = parentId ? `/api/road-rating-comments/${parentId}/child` : '/api/road-rating-comments';
            const csrfToken = getCsrfToken();
            const payload = {
                content: values.content,
                roadRatingId: values.roadRatingId,
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
        onMutate: async (newReview) => {
            const queryKey = [`/api/road-ratings/${roadRatingId}/comments-nested`];

            await queryClient.cancelQueries({ queryKey });

            const previousData = queryClient.getQueryData(queryKey);

            const newCommentData: Comment = {
                id: String(Math.random()),
                content: newReview.content,
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
                    comments: [newCommentData, ...(oldData?.data?.comments || [])],
                    total: (oldData?.data?.total || 0) + 1,
                },
            }));

            return { previousData };
        },
        onError: (error: any, variables, context: any) => {
            if (context?.previousData) {
                queryClient.setQueryData([`/api/road-ratings/${roadRatingId}/comments-nested`], context.previousData);
            }

            const errorMessage = error.response?.data?.errors
                ? Object.values(error.response.data.errors)[0]
                : error.message || 'Failed to post comment. Please try again.';

            toast.error(String(errorMessage), {
                position: 'top-right',
                duration: 4000,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [`/api/road-ratings/${roadRatingId}/comments-nested`],
            });

            if (parentId) {
                queryClient.invalidateQueries({
                    queryKey: [`/api/road-rating-comments/${parentId}/children`],
                });
                queryClient.invalidateQueries({
                    queryKey: [`/api/road-rating-comments/${parentId}/child-count`],
                });
            }

            toast.success('Comment posted successfully!', {
                position: 'top-right',
                duration: 3000,
            });

            reviewForm.reset({
                content: '',
                roadRatingId: String(roadRatingId),
                parentId: parentId ? String(parentId) : undefined,
            });

            onSubmitSuccess?.();
        },
    });

    const onSubmit = async (data: z.infer<typeof ReviewFormSchema>) => {
        await submitReviewMutation.mutateAsync(data);
    };

    return (
        <Form {...reviewForm}>
            <form onSubmit={reviewForm.handleSubmit(onSubmit)} className="mt-4 space-y-4">
                <div className="flex gap-3">
                    <UserAvatar imageUrl={user?.image} firstName={user?.firstName} lastName={user?.lastName} />
                    <div className="flex-1">
                        <FormField
                            control={reviewForm.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <RichTextEditor value={field.value} onChange={field.onChange} placeholder="Write your comment here..." />
                                    </FormControl>
                                    <FormMessage>{reviewForm.formState.errors.content?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                        <div className="mt-2 flex gap-2">
                            <button
                                type="submit"
                                disabled={submitReviewMutation.isPending}
                                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                            >
                                {submitReviewMutation.isPending ? 'Posting...' : 'Post Comment'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
}
