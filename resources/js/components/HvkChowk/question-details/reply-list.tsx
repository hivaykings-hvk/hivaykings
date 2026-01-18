'use client';

import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { ReplyItem } from './reply-item';

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

interface ReplyListProps {
    questionId: string;
    user: User | null;
}

const REPLIES_PER_PAGE = 10;

export default function ReplyList({ questionId, user }: ReplyListProps) {
    const [offset, setOffset] = useState(0);

    const { data, isLoading, error, isPreviousData } = useQuery({
        queryKey: [`/api/questions/${questionId}/replies`],
        queryFn: async () => {
            const response = await axios.get(`/api/questions/${questionId}/replies`, {
                params: { offset: 0, limit: REPLIES_PER_PAGE },
            });
            return response.data.data;
        },
    });

    const { data: moreRepliesData, isPreviousData: isPreviousMoreData } = useQuery({
        queryKey: [`/api/questions/${questionId}/replies`, offset],
        queryFn: async () => {
            if (offset === 0) return null;
            const response = await axios.get(`/api/questions/${questionId}/replies`, {
                params: { offset, limit: REPLIES_PER_PAGE },
            });
            return response.data.data;
        },
        enabled: offset > 0,
    });

    const replies = data?.replies || [];
    const totalReplies = data?.total || 0;
    const childCounts = data?.childCounts || {};

    const allReplies = offset === 0 ? replies : [...replies, ...(moreRepliesData?.replies || [])];
    const hasMore = allReplies.length < totalReplies;

    const handleLoadMore = () => {
        setOffset((prev) => prev + REPLIES_PER_PAGE);
    };

    if (isLoading) {
        return <div className="py-6 text-center">Loading replies...</div>;
    }

    if (error) {
        return <div className="py-6 text-center text-red-500">Failed to load replies</div>;
    }

    return (
        <div className="space-y-4">
            {allReplies.map((reply: Reply) => (
                <ReplyItem key={reply.id} reply={reply} questionId={questionId} initialChildCount={childCounts[reply.id] || 0} user={user} />
            ))}
            {hasMore && (
                <Button variant="outline" onClick={handleLoadMore} disabled={isLoading || isPreviousData || isPreviousMoreData} className="w-full">
                    {isLoading || isPreviousData || isPreviousMoreData ? 'Loading...' : 'Load More Replies'}
                </Button>
            )}
        </div>
    );
}
