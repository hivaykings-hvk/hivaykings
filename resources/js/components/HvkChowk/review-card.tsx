import { Button } from '@/Components/ui/button';
import { Flag, MessageCircle, ThumbsUp } from 'lucide-react';

interface ReviewCardProps {
    comment: string;
    user: {
        firstName: string;
        lastName: string;
        image?: string;
    };
    createdAt: string;
}

function getTimeAgo(date: string): string {
    const now = new Date();
    const commentDate = new Date(date);
    const seconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return commentDate.toLocaleDateString();
}

export default function ReviewCard({ comment, user, createdAt }: ReviewCardProps) {
    const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

    return (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    {user.image ? (
                        <img src={user.image} alt={`${user.firstName} ${user.lastName}`} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-sm font-semibold text-yellow-700">
                            {initials}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-800">
                            {user.firstName} {user.lastName}
                        </h4>
                        <span className="text-sm text-gray-500">{getTimeAgo(createdAt)}</span>
                    </div>
                    <p className="mt-2 text-gray-700">{comment}</p>

                    {/* Action Buttons */}
                    <div className="mt-3 flex gap-4">
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                            <ThumbsUp className="mr-1 h-4 w-4" /> Helpful
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                            <MessageCircle className="mr-1 h-4 w-4" /> Reply
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-600">
                            <Flag className="mr-1 h-4 w-4" /> Report
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
