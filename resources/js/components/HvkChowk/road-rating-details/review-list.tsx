'use client';

import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { ReviewItem } from './review-item';

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    abuseReported?: boolean;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        title: string;
        image: string;
    };
    childCount: number;
}

interface ReviewListProps {
    roadRatingId: string;
    user: User | null;
    onReviewSubmitted?: () => void;
}

const COMMENTS_PER_PAGE = 10;

export default function ReviewList({ roadRatingId, user, onReviewSubmitted }: ReviewListProps) {
    const [offset, setOffset] = useState(0);

    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: [`/api/road-ratings/${roadRatingId}/comments-nested`],
        queryFn: async () => {
            const response = await axios.get(`/api/road-ratings/${roadRatingId}/comments-nested`, {
                params: { offset: 0, limit: COMMENTS_PER_PAGE },
            });
            return response.data.data;
        },
    });

    const { data: moreCommentsData, isFetching: isFetchingMore } = useQuery({
        queryKey: [`/api/road-ratings/${roadRatingId}/comments-nested`, offset],
        queryFn: async () => {
            if (offset === 0) return null;
            const response = await axios.get(`/api/road-ratings/${roadRatingId}/comments-nested`, {
                params: { offset, limit: COMMENTS_PER_PAGE },
            });
            return response.data.data;
        },
        enabled: offset > 0,
    });

    const comments = data?.comments || [];
    const totalComments = data?.total || 0;
    const childCounts = data?.childCounts || {};

    const allComments = offset === 0 ? comments : [...comments, ...(moreCommentsData?.comments || [])];
    const hasMore = allComments.length < totalComments;

    const handleLoadMore = () => {
        setOffset((prev) => prev + COMMENTS_PER_PAGE);
    };

    if (isLoading) {
        return <div className="py-6 text-center">Loading comments...</div>;
    }

    if (error) {
        return <div className="py-6 text-center text-red-500">Failed to load comments</div>;
    }

    return (
        <div className="space-y-4">
            {allComments.map((comment: Comment) => (
                <ReviewItem
                    key={comment.id}
                    comment={comment}
                    roadRatingId={roadRatingId}
                    initialChildCount={childCounts[comment.id] || 0}
                    user={user}
                    onReviewSubmitted={onReviewSubmitted}
                />
            ))}
            {hasMore && (
                <Button variant="outline" onClick={handleLoadMore} disabled={isLoading || isFetching || isFetchingMore} className="w-full">
                    {isLoading || isFetching || isFetchingMore ? 'Loading...' : 'Load More Comments'}
                </Button>
            )}
        </div>
    );
}
