'use client';

import { User } from '@/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import TravelogueCommentItem from './travelogue-comment-item';

interface TravelogueCommentListProps {
    travelogueId: string;
    user: User | null;
}

export default function TravelogueCommentList({ travelogueId, user }: TravelogueCommentListProps) {
    const { data: commentsData, isLoading } = useQuery({
        queryKey: ['travelogue-comments', travelogueId],
        queryFn: async () => {
            const response = await axios.get(`/api/travelogues/${travelogueId}/comments-nested`);
            return response.data.data || [];
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });

    if (isLoading) {
        return <div className="py-8 text-center text-gray-500">Loading comments...</div>;
    }

    if (!commentsData || commentsData.length === 0) {
        return <div className="py-8 text-center text-gray-500">No comments yet. Be the first to comment!</div>;
    }

    return (
        <div className="space-y-3">
            {commentsData.map((comment: any) => (
                <TravelogueCommentItem
                    key={comment.id}
                    comment={comment}
                    travelogueId={travelogueId}
                    level={0}
                    initialChildCount={comment.childCount || 0}
                    user={user}
                />
            ))}
        </div>
    );
}
