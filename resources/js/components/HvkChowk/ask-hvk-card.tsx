import { Question as BaseQuestion } from '@/entity/question.entity'; // Rename original Question
import { timeAgo } from '@/lib/time-functions';
import { titleColorMap } from '@/lib/title-color-map';
import parse, { DOMNode, Element, Text } from 'html-react-parser';
import React from 'react';
import { FaRegComment, FaRegHeart } from 'react-icons/fa';
import ShareButton from '../share-button';
import UserAvatar from '../UserAvatar';
import { getProcessedDescription } from '@/lib/html-truncate-util';

// Define a minimal User interface for the AskHVKCard, matching the API response
interface UserForCard {
    id: string;
    firstName: string;
    lastName: string;
    image?: string;
    title: string;
}

// Extend the BaseQuestion interface to include the user property with UserForCard type
export interface QuestionWithUser extends Omit<BaseQuestion, 'user'> {
    user: UserForCard;
}

interface Stats {
    views: number;
    replies: number;
}

interface AskHVKCardProps {
    question: QuestionWithUser;
    stats: Stats;
}

const AskHVKCard: React.FC<AskHVKCardProps> = ({ question, stats }) => {
    console.log('Rendering AskHVKCard with question:', question);
    const tags = question.hashtags ? question.hashtags.split(/\s+/).filter((tag) => tag.length > 0) : [];
    const fromToLocation = question.fromCity && question.toCity ? `${question.fromCity} → ${question.toCity}` : '';

    const userImage = question.user?.image || `${process.env.NEXT_PUBLIC_OCI_BUCKET_BASE_URL}default-avatar.webp`; // Fallback for user image
    const userName = `${question.user?.firstName} ${question.user?.lastName}`;

    return (
        <div className="m-6 mx-auto rounded-lg border-l-4 border-blue-500 bg-white p-4 shadow-lg">
            <div className="mb-4 flex space-x-3">
                <div className="min-w-12 grow-0">
                    <UserAvatar imageUrl={userImage} firstName={question?.user?.firstName} lastName={question?.user?.lastName} />
                </div>

                <div className="flex flex-col">
                    <div className="mb-2 flex items-center space-x-2">
                        <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">Ask Hvk</span>
                        {fromToLocation && <span className="text-sm text-gray-600">{fromToLocation}</span>}
                    </div>
                    <a href={`/hvk-chowk/question/${question.id}`} className="text-xl font-semibold text-gray-900 hover:underline">
                        <h3>{question.subject}</h3>
                    </a>
                    <div className="mt-4 mb-4 text-gray-700">
                        <p>{getProcessedDescription(question.description ?? '', 200)}</p>
                    </div>
                    <div className="mb-4 flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                            <span key={index} className="rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-normal text-yellow-700">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="mb-4 flex flex-wrap items-center gap-6 text-sm text-gray-500">
                        <div className="flex flex-wrap items-center gap-6">
                            <span className="font-normal text-gray-700">{userName}</span>
                            <span
                                className={`${titleColorMap[question.user?.title || 'default']?.bgColor} ${
                                    titleColorMap[question.user?.title || 'default']?.textColor
                                } rounded-[4px] px-2.5 py-0.5 text-xs font-normal`}
                            >
                                {question.user?.title}
                            </span>
                            <span>{timeAgo(question.createdAt)}</span>
                            <span>{stats.views} views</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-gray-600">
                        <div className="flex items-center space-x-1">
                            <FaRegHeart className="h-4 w-4" />
                            <span>0 likes</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <FaRegComment className="h-4 w-4" />
                            <span>{stats.replies} replies</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <ShareButton
                                title={question.subject}
                                text={getProcessedDescription(question.description ?? '', 200)}
                                url={`/question/${question.id}`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AskHVKCard;
