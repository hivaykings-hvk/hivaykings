'use client';

import { User } from '@/types';
import axios from 'axios';
import { useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { toast } from 'sonner';

interface LikeButtonProps {
    initialLikesCount: number;
    questionId: string;
    user: User | null;
}

export default function LikeButton({ initialLikesCount, questionId, user }: LikeButtonProps) {
    const [likesCount, setLikesCount] = useState(initialLikesCount);
    const [isLoading, setIsLoading] = useState(false);

    const handleLike = async () => {
        if (!user) {
            toast.error('Please login to like question or reply');
            return;
        }

        setIsLoading(true);
        setLikesCount((prev) => prev + 1);

        try {
            await axios.post(
                `/api/questions/${questionId}/like`,
                {},
                {
                    headers: {
                        'X-CSRF-Token': getCsrfToken(),
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                },
            );
            toast.success('Question liked!');
        } catch (error: any) {
            setLikesCount((prev) => prev - 1);
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
        } finally {
            setIsLoading(false);
        }
    };

    const getCsrfToken = () => {
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        return token || '';
    };

    return (
        <div className="flex cursor-pointer items-center gap-2" onClick={handleLike}>
            <FaHeart className="h-4 w-4 text-red-500" />
            <span>
                {likesCount} <span className="hidden sm:inline">likes</span>
            </span>
        </div>
    );
}
