'use client';

import { User } from '@/types';
import ReplyList from './reply-list';

interface RepliesContainerProps {
    questionId: string;
    user: User | null;
    onReplySubmitted?: () => void;
}

export default function RepliesContainer({ questionId, user, onReplySubmitted }: RepliesContainerProps) {
    return <ReplyList questionId={questionId} user={user} onReplySubmitted={onReplySubmitted} />;
}
