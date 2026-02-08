'use client';

import { User } from '@/types';
import ReplyForm from './reply-form';

interface RootReplyFormProps {
    questionId: string | number;
    user: User | null;
}

export default function RootReplyForm({ questionId, user }: RootReplyFormProps) {
    if (user) {
        return <ReplyForm questionId={String(questionId)} user={user} />;
    }

    // Show login prompt if not logged in
    const fullUrl = typeof window !== 'undefined' ? window.location.href : '';
    return (
        <div className="mt-8 py-6">
            <a
                href={`/auth/signin?redirectUrl=${encodeURIComponent(fullUrl)}`}
                className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-gray-800"
            >
                Share your reply
            </a>
        </div>
    );
}
