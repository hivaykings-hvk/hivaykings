'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Comment {
    id: number;
    content: string;
    user: {
        id: number;
        name: string;
        email: string;
        avatar_url: string;
    };
    likes_count: number;
    is_liked: boolean;
    created_at: string;
}

interface CommentsResponse {
    data: Comment[];
}

interface CommentsSectionProps {
    questionId: number;
}

const CommentsSection = ({ questionId }: CommentsSectionProps) => {
    const [comment, setComment] = useState('');
    const queryClient = useQueryClient();

    const { data: commentsData, isLoading } = useQuery({
        queryKey: ['comments', questionId],
        queryFn: async () => {
            const response = await fetch(`/api/questions/${questionId}/comments`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch comments');
            }

            return (await response.json()) as CommentsResponse;
        },
    });

    const createCommentMutation = useMutation({
        mutationFn: async (content: string) => {
            const response = await fetch(`/api/questions/${questionId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'include',
                body: JSON.stringify({ content }),
            });

            if (!response.ok) {
                const data = await response.json();
                if (response.status === 401) {
                    throw new Error('Please login to comment');
                }
                throw new Error(data.message || 'Failed to comment');
            }

            return response.json();
        },
        onSuccess: () => {
            setComment('');
            queryClient.invalidateQueries({ queryKey: ['comments', questionId] });
            toast.success('Comment added!');
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });

    const likeCommentMutation = useMutation({
        mutationFn: async (commentId: number) => {
            const response = await fetch(`/api/comments/${commentId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const data = await response.json();
                if (response.status === 401) {
                    throw new Error('Please login to like');
                }
                throw new Error(data.message || 'Failed to like comment');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', questionId] });
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (comment.trim()) {
            createCommentMutation.mutate(comment);
        }
    };

    const formatDate = (date: string) => {
        const d = new Date(date);
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            if (hours === 0) {
                const minutes = Math.floor(diff / (1000 * 60));
                return `${minutes}m ago`;
            }
            return `${hours}h ago`;
        }
        if (days === 1) return 'yesterday';
        if (days < 7) return `${days}d ago`;
        return d.toLocaleDateString();
    };

    return (
        <div className="mt-6 border-t border-gray-200 pt-4">
            <h4 className="mb-4 font-semibold">Comments</h4>

            {/* Add Comment */}
            <form onSubmit={handleSubmitComment} className="mb-4 flex gap-2">
                <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment..." className="flex-1" />
                <Button type="submit" size="sm" disabled={createCommentMutation.isPending}>
                    {createCommentMutation.isPending ? 'Posting...' : 'Post'}
                </Button>
            </form>

            {/* Comments List */}
            {isLoading ? (
                <div className="text-sm text-gray-500">Loading comments...</div>
            ) : commentsData && commentsData.data.length > 0 ? (
                <div className="space-y-3">
                    {commentsData.data.map((c) => (
                        <div key={c.id} className="rounded-lg bg-gray-50 p-3">
                            <div className="mb-2 flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={c.user.avatar_url} />
                                        <AvatarFallback>{c.user.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-semibold">{c.user.name}</p>
                                        <p className="text-xs text-gray-500">{formatDate(c.created_at)}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="h-auto p-0" onClick={() => likeCommentMutation.mutate(c.id)}>
                                    <Heart size={14} className={c.is_liked ? 'fill-red-500 text-red-500' : ''} />
                                    <span className="ml-1 text-xs">{c.likes_count}</span>
                                </Button>
                            </div>
                            <p className="text-sm text-gray-700">{c.content}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500">No comments yet</p>
            )}
        </div>
    );
};

export default CommentsSection;
