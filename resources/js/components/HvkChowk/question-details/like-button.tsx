'use client';

import { User } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from 'sonner';

interface LikeButtonProps {
    initialLikesCount: number;
    questionId: string;
    user: User | null;
    initialIsLiked?: boolean;
}

export default function LikeButton({ initialLikesCount, questionId, user, initialIsLiked = false }: LikeButtonProps) {
    const queryClient = useQueryClient();
    const [likesCount, setLikesCount] = useState(initialLikesCount);
    const [isLiked, setIsLiked] = useState(initialIsLiked);

    const getCsrfToken = () => {
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        return token || '';
    };

    const likeMutation = useMutation({
        mutationFn: async () => {
            const response = await axios.post(
                `/api/questions/${questionId}/like`,
                {},
                {
                    headers: {
                        'X-CSRF-Token': getCsrfToken(),
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                },
            );
            return response.data;
        },
        onMutate: async () => {
            const previousLikesCount = likesCount;
            const previousIsLiked = isLiked;

            // Optimistic update
            setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
            setIsLiked(!isLiked);

            return { previousLikesCount, previousIsLiked };
        },
        onSuccess: (data) => {
            setLikesCount(data.likesCount);
            setIsLiked(data.isLiked);
            toast.success(data.isLiked ? 'Question liked!' : 'Question unliked!');

            // Invalidate queries to update ask-hvk-card
            queryClient.invalidateQueries({ queryKey: ['questions'], exact: false });
        },
        onError: (error: any, variables, context) => {
            // Rollback on error
            if (context) {
                setLikesCount(context.previousLikesCount);
                setIsLiked(context.previousIsLiked);
            }
            console.error('Error liking question:', error);
            if (error.response?.status === 422) {
                const errors = error.response?.data?.errors;
                if (errors) {
                    Object.values(errors).forEach((err: any) => {
                        toast.error(Array.isArray(err) ? err[0] : err);
                    });
                }
            } else {
                toast.error('Failed to like question');
            }
        },
    });

    const handleLike = () => {
        if (!user) {
            toast.error('Please login to like question or reply');
            return;
        }
        likeMutation.mutate();
    };

    return (
        <button
            onClick={handleLike}
            disabled={likeMutation.isPending}
            className="flex cursor-pointer items-center gap-2 transition-colors hover:text-red-500 disabled:opacity-50"
        >
            {isLiked ? <FaHeart className="h-4 w-4 text-red-500" /> : <FaRegHeart className="h-4 w-4" />}
            <span>
                {likesCount} <span className="hidden sm:inline">likes</span>
            </span>
        </button>
    );
}
