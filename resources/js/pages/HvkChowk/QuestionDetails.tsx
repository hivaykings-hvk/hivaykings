import LikeButton from '@/Components/HvkChowk/question-details/like-button';
import RepliesContainer from '@/Components/HvkChowk/question-details/replies-container';
import { ReplyFormProvider, useReplyFormContext } from '@/Components/HvkChowk/question-details/reply-form-context';
import RootReplyForm from '@/Components/HvkChowk/question-details/root-reply-form';
import { ReactQueryProvider } from '@/Components/HvkChowk/react-query-provider';
import Link from '@/Components/Link';
import UserAvatar from '@/Components/UserAvatar';
import RootLayout from '@/Layouts/RootLayout';
import { timeAgo } from '@/lib/time-functions';
import { titleColorMap } from '@/lib/title-color-map';
import { User } from '@/types';
import { usePage } from '@inertiajs/react';
import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import { FaBookmark, FaClock, FaEye, FaFlag, FaHeart, FaLink, FaReply, FaShare } from 'react-icons/fa';
import { HiArrowNarrowLeft } from 'react-icons/hi';

const OCI_BUCKET_BASE_URL = import.meta.env.VITE_OCI_BUCKET_BASE_URL || 'https://hvk-chowk.s3.com';

interface QuestionDetailsProps {
    question: {
        id: string | number;
        subject: string;
        description: string;
        fromCity: string;
        toCity: string;
        hashtags?: string;
        category?: string;
        viewsCount: number;
        likesCount: number;
        isLiked?: boolean;
        createdAt: string;
        user: {
            id: string | number;
            firstName: string;
            lastName: string;
            title: string;
            image: string;
        };
    };
    totalReplies: number;
    auth?: {
        user?: User;
    };
}

function QuestionDetails({ question, totalReplies }: QuestionDetailsProps) {
    const { auth } = usePage().props;
    const user = (auth as any)?.user || null;
    const [fullUrl, setFullUrl] = useState('');
    const hashtags = question.hashtags?.split(/\s+/).filter((tag: string) => tag.length > 0) || [];

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setFullUrl(`${window.location.origin}/hvk-chowk/question/${question.id}`);
        }
    }, [question.id]);

    const handleBackClick = () => {
        if (typeof window !== 'undefined') {
            window.history.back();
        }
    };

    const ContentWithContext = () => {
        const { openReplyFormId, setOpenReplyFormId } = useReplyFormContext();

        return (
            <div className="bg-gray-50">
                <div className="container mx-auto">
                    <div className="px-3 py-6">
                        {/** Question title section */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button onClick={handleBackClick}>
                                    <HiArrowNarrowLeft className="h-5 w-5 text-primary" />
                                </button>
                                <div className="hidden font-semibold text-gray-800 md:inline">{question?.subject}</div>
                            </div>
                            {user ? (
                                <a href="#share-your-reply" className="rounded-xl bg-primary px-3 py-1 text-sm text-gray-800">
                                    Reply
                                </a>
                            ) : (
                                <a
                                    href={`/auth/signin?redirectUrl=${encodeURIComponent(fullUrl + '#share-your-reply')}`}
                                    className="rounded-xl bg-primary px-3 py-1 text-sm text-gray-800"
                                >
                                    Reply
                                </a>
                            )}
                        </div>
                        {/** Question title section End */}

                        <div className="flex flex-col gap-6 py-8 lg:flex-row lg:items-start lg:justify-between">
                            {/** Question details section */}
                            <div className="flex-1 grow lg:w-3/4">
                                <div className="mb-8 rounded-lg bg-white p-6 shadow-xl">
                                    {/* Top section: Tags and Action Icons */}
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex gap-2">
                                            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">Ask Hvk</span>
                                            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                                {question?.fromCity} {' → '} {question?.toCity}
                                            </span>
                                        </div>
                                        <div className="flex cursor-pointer gap-3 text-gray-500">
                                            <FaBookmark className="h-4 w-4" />
                                            <FaShare className="h-4 w-4" />
                                            <FaFlag className="h-4 w-4" />
                                            <FaLink className="h-4 w-4" />
                                        </div>
                                    </div>

                                    {/* Question Title */}
                                    <h1 className="mb-4 text-xl font-semibold text-gray-800">{question?.subject}</h1>

                                    {/* Stats Section */}
                                    <div className="flex items-center gap-6 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <FaEye className="h-4 w-4" />
                                            <span>
                                                {question.viewsCount} <span className="hidden sm:inline">views</span>
                                            </span>
                                        </div>
                                        <Link
                                            href={`/hvk-chowk/question/${question.id}#question-replies`}
                                            className="flex items-center gap-2 hover:cursor-pointer"
                                        >
                                            <FaReply className="h-4 w-4" />
                                            <span>
                                                {totalReplies} <span className="hidden sm:inline">replies</span>
                                            </span>
                                        </Link>
                                        <LikeButton
                                            initialLikesCount={question.likesCount}
                                            questionId={String(question.id)}
                                            user={user}
                                            initialIsLiked={question.isLiked}
                                        />
                                        <div className="flex items-center gap-2">
                                            <FaClock className="h-4 w-4" />
                                            <span>{timeAgo(question.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg bg-white p-6 shadow-xl">
                                    {/* Header */}
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <UserAvatar
                                                imageUrl={question.user?.image}
                                                firstName={question.user?.firstName}
                                                lastName={question.user?.lastName}
                                            />
                                            <div>
                                                <div className="font-semibold text-gray-800">
                                                    {question.user?.firstName} {question.user?.lastName}
                                                </div>
                                                <span
                                                    className={`${titleColorMap[question.user?.title ?? 'default']?.bgColor} ${
                                                        titleColorMap[question.user?.title ?? 'default']?.textColor
                                                    } rounded-full px-2.5 py-0.5 text-xs font-normal`}
                                                >
                                                    {question.user?.title}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-500">{timeAgo(question.createdAt)}</div>
                                    </div>

                                    {/* Content */}
                                    <div className="mb-4 text-gray-700">{parse(question?.description ?? '')}</div>

                                    {/* Footer */}
                                    <div className="flex flex-col-reverse justify-between gap-4 text-sm text-gray-500 sm:flex-col-reverse lg:flex-row lg:items-center lg:gap-0">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1 text-green-600">
                                                <FaHeart className="h-4 w-4" />
                                                <span>8 Helpful</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <FaHeart className="h-4 w-4" />
                                                <span>0</span>
                                            </div>
                                            <div
                                                className="flex cursor-pointer items-center gap-1 text-orange-500"
                                                onClick={() => {
                                                    setOpenReplyFormId(null);
                                                }}
                                            >
                                                <FaReply className="h-4 w-4" />
                                                <span>Reply</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {hashtags.map((hashtag: string, index: number) => (
                                                <span key={index} className="text-gray-400">
                                                    {hashtag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8" id="question-replies">
                                    {totalReplies > 0 ? (
                                        <RepliesContainer questionId={String(question.id)} user={user} />
                                    ) : (
                                        <div className="bg-white py-6">No replies yet. Be the first to reply!</div>
                                    )}

                                    {!openReplyFormId && <RootReplyForm questionId={String(question.id)} user={user} />}
                                </div>
                            </div>
                            {/** Related Questions section */}
                            <div className="h-fit grow-0 rounded-lg bg-white p-6 shadow-xl lg:w-1/4">
                                <div className="mb-4 flex items-center gap-2">
                                    <FaLink className="h-4 w-4 text-primary" />
                                    <h2 className="text-lg font-semibold text-gray-800">Related Threads</h2>
                                </div>
                                <div className="rounded-lg border border-gray-200 p-4">
                                    <p className="text-md mb-1 font-medium text-gray-800">Spiti Valley in October - Road conditions?</p>
                                    <p className="text-sm text-gray-600">8 replies</p>
                                </div>
                            </div>
                            {/** Related Questions section End */}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <ReactQueryProvider>
            <ReplyFormProvider>
                <ContentWithContext />
            </ReplyFormProvider>
        </ReactQueryProvider>
    );
}

QuestionDetails.layout = function (page: React.ReactNode) {
    return <RootLayout>{page}</RootLayout>;
};

export default QuestionDetails;
