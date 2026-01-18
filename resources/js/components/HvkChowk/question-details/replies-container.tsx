'use client';

import { User } from '@/types';
import ReplyList from './reply-list';

interface RepliesContainerProps {
    questionId: string;
    user: User | null;
}

export default function RepliesContainer({ questionId, user }: RepliesContainerProps) {
    return <ReplyList questionId={questionId} user={user} />;
}
