import { timeAgo, timeUntil } from '@/lib/time-functions';
import { titleColorMap } from '@/lib/title-color-map';
import React, { useState } from 'react';
import { FaRegComment, FaRegHeart } from 'react-icons/fa';
import { FaClock } from 'react-icons/fa6';
import { toast } from 'sonner';
import UserAvatar from '../UserAvatar';
import VoteModal from './vote-modal';

interface PollOption {
    id: string;
    optionText: string;
    votes: number;
}

interface User {
    id: number | string;
    name?: string;
    email?: string;
    [key: string]: any;
}

interface PollCardProps {
    poll: {
        id: string;
        questionText: string;
        tags?: string;
        description?: string;
        createdAt: string;
        expiresAt: string;
        userId: string;
        user?: {
            firstName: string;
            lastName: string;
            title: string;
            image?: string;
        };
    };
    options: PollOption[];
    totalVotes: number;
    onVoteSuccess?: () => void;
    user?: User | null;
}

const PollCard: React.FC<PollCardProps> = ({ poll, options, totalVotes, onVoteSuccess, user }) => {
    const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);

    const userName = poll.user ? `${poll.user.firstName} ${poll.user.lastName}` : 'Anonymous';
    const userImage = poll.user?.image || `${process.env.NEXT_PUBLIC_OCI_BUCKET_BASE_URL}default-avatar.webp`;

    // Check if poll is active
    const pollExpiresAt = new Date(poll.expiresAt);
    const now = new Date();
    const isActive = pollExpiresAt > now;

    const tags = poll.tags ? poll.tags.split(' ') : [];

    const calculatePercentage = (votes: number) => {
        if (totalVotes === 0) return 0;
        return Math.round((votes / totalVotes) * 100);
    };

    const handleVoteNowClick = () => {
        if (!user) {
            toast.error('Please sign in to vote');
            return;
        }
        setIsVoteModalOpen(true);
    };

    const handleVoteSuccess = () => {
        if (onVoteSuccess) {
            onVoteSuccess();
        }
    };

    return (
        <div className="m-6 mx-auto rounded-lg border-l-4 border-purple-500 bg-white p-6 shadow-lg">
            <div className="mb-4 flex space-x-3">
                <div className="min-w-12 grow-0">
                    <UserAvatar imageUrl={userImage} firstName={poll?.user?.firstName} lastName={poll?.user?.lastName} />
                </div>
                <div className="flex grow-1 flex-col">
                    {/* Header with status badge and category */}
                    <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">Poll</div>
                        {isActive ? (
                            <div className="rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-white">Active</div>
                        ) : (
                            <div className="rounded-full bg-gray-400 px-3 py-1 text-xs font-medium text-white">Ended</div>
                        )}
                        <div className="text-sm text-gray-500">Closes {timeUntil(poll.expiresAt)}</div>
                    </div>

                    {/* Poll Question */}
                    <h3 className="text-md mb-6 font-medium text-gray-900">{poll.questionText}</h3>

                    {/* Poll Options with Vote Results */}
                    <div className="mb-6 space-y-4">
                        {options.map((option) => {
                            const percentage = calculatePercentage(option.votes);
                            return (
                                <div key={option.id} className="rounded-lg bg-gray-50 p-4">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-gray-700">{option.optionText}</span>
                                        <span className="text-sm font-semibold text-gray-600">{percentage}%</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-gray-200">
                                        <div
                                            className="h-2 rounded-full bg-yellow-400 transition-all duration-300"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-sm text-gray-400">{option.votes} Votes</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Tags */}
                    {tags.length > 0 && (
                        <div className="mb-6 flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                                <span key={index} className="rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-normal text-yellow-700">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Total votes display area */}

                    <div className="flex items-center justify-between rounded-md bg-purple-50 p-2">
                        <div className="text-sm text-purple-800">Total Votes : {totalVotes}</div>
                        <div className="inline-flex items-center gap-1 text-sm text-purple-800">
                            <FaClock /> Closes {timeUntil(poll.expiresAt)}
                        </div>
                    </div>

                    {/* User Info and Metadata */}
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-3">
                            <span className="text-base text-gray-800">{userName}</span>
                            {poll.user && (
                                <span
                                    className={`ml-2 ${titleColorMap[poll.user.title || 'default']?.bgColor} ${
                                        titleColorMap[poll.user.title || 'default']?.textColor
                                    } rounded px-2 py-0.5 text-xs font-normal`}
                                >
                                    {poll.user.title}
                                </span>
                            )}
                            <span className="text-sm text-gray-500">{timeAgo(poll.createdAt)}</span>
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center space-x-1">
                                <FaRegHeart className="h-4 w-4" />
                                <span>28</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <FaRegComment className="h-4 w-4" />
                                <span>45 comments</span>
                            </div>
                            <button className="hover:text-primary">Share</button>
                            <button
                                onClick={handleVoteNowClick}
                                disabled={!isActive}
                                className="rounded-full bg-primary px-4 py-1 text-gray-800 transition-colors hover:cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-400"
                            >
                                Vote Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vote Modal */}
            <VoteModal
                isOpen={isVoteModalOpen}
                onClose={() => setIsVoteModalOpen(false)}
                pollId={poll.id}
                pollQuestion={poll.questionText}
                options={options}
                onVoteSuccess={handleVoteSuccess}
            />
        </div>
    );
};

export default PollCard;
