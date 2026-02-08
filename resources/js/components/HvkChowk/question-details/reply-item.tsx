'use client';

import { Button } from '@/Components/ui/button';
import UserAvatar from '@/Components/UserAvatar';
import { timeAgo } from '@/lib/time-functions';
import { titleColorMap } from '@/lib/title-color-map';
import { User } from '@/types';
import axios from 'axios';
import clsx from 'clsx';
import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import { FaHeart, FaReply } from 'react-icons/fa';
import { FaCircleCheck, FaRegComment } from 'react-icons/fa6';
import ReplyForm from './reply-form';
import { useReplyFormContext } from './reply-form-context';

const OCI_BUCKET_BASE_URL = import.meta.env.VITE_OCI_BUCKET_BASE_URL || 'https://hvk-chowk.s3.com';

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

interface ReplyItemProps {
    reply: Reply;
    questionId: string;
    level?: number;
    initialChildCount: number;
    user: User | null;
}

const CHILD_REPLIES_PER_PAGE = 5;

export function ReplyItem({ reply, questionId, level = 0, initialChildCount, user }: ReplyItemProps) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [childReplies, setChildReplies] = useState<Reply[]>([]);
    const [childRepliesCount, setChildRepliesCount] = useState<number>(initialChildCount);
    const [isChildRepliesLoaded, setIsChildRepliesLoaded] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState('');
    const { openReplyFormId, setOpenReplyFormId } = useReplyFormContext();

    useEffect(() => {
        // Close this form if another reply form is opened or if root form is activated
        if (openReplyFormId && openReplyFormId !== reply.id && showReplyForm) {
            setShowReplyForm(false);
        }
        // Also close this form if openReplyFormId is null (user clicked question Reply button)
        if (openReplyFormId === null && showReplyForm) {
            setShowReplyForm(false);
        }
    }, [openReplyFormId, reply.id, showReplyForm]);

    useEffect(() => {
        if (initialChildCount === 0) {
            loadChildRepliesCount();
        }
        if (typeof window !== 'undefined') {
            setRedirectUrl(window.location.href);
        }
    }, [initialChildCount]);

    const loadChildRepliesCount = async () => {
        try {
            const response = await axios.get(`/api/replies/${reply.id}/child-count`);
            setChildRepliesCount(response.data.data.count || 0);
        } catch (error) {
            console.error('Error loading child replies count:', error);
        }
    };

    const handleLoadChildReplies = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/replies/${reply.id}/children`, {
                params: { offset: offset, limit: CHILD_REPLIES_PER_PAGE },
            });

            const data = response.data.data;
            const newReplies = data.replies || [];
            setChildReplies((prev) => [...prev, ...newReplies]);
            setOffset((prev) => prev + newReplies.length);
            setHasMore(offset + newReplies.length < (data.total || 0));
            setIsChildRepliesLoaded(true);
        } catch (error) {
            console.error('Error loading child replies:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleChildReplies = () => {
        if (isChildRepliesLoaded) {
            setIsChildRepliesLoaded(false);
            setChildReplies([]);
            setOffset(0);
        } else {
            handleLoadChildReplies();
        }
    };

    const handleToggleReplyForm = (isOpen: boolean) => {
        setShowReplyForm(isOpen);
        if (isOpen) {
            setOpenReplyFormId(reply.id);
        } else {
            setOpenReplyFormId(null);
        }
    };

    const updateChildCount = async () => {
        await loadChildRepliesCount();
    };

    const renderReplyContent = () => {
        if (level === 0) {
            return (
                <div className={clsx(`rounded-lg bg-white p-6 shadow-xl`, reply.user.title === 'Chief' && 'border-2 border-primary')}>
                    {/* Header */}
                    {reply.user.title === 'Chief' && (
                        <div className="mb-4 flex items-center justify-start gap-4">
                            <div className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1">
                                <FaCircleCheck className="h-3 w-3" /> <span className="text-xs font-semibold">Verified Answer</span>
                            </div>
                            <div className="rounded-full bg-red-200 px-3 py-1 text-xs font-semibold text-red-800">Pinned</div>
                        </div>
                    )}
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <UserAvatar imageUrl={reply.user.image} firstName={reply.user.firstName} lastName={reply.user.lastName} />
                            <div>
                                <div className="font-semibold text-gray-800">
                                    {reply.user.firstName} {reply.user.lastName}
                                </div>
                                <span
                                    className={`${titleColorMap[reply.user?.title ?? 'default']?.bgColor} ${
                                        titleColorMap[reply.user?.title ?? 'default']?.textColor
                                    } rounded-full px-2.5 py-0.5 text-xs font-normal`}
                                >
                                    {reply.user.title}
                                </span>
                            </div>
                        </div>
                        <div className="text-sm text-gray-500">{timeAgo(reply.createdAt)}</div>
                    </div>

                    {/* Content */}
                    <div className="mb-4 text-gray-700">{parse(reply.content)}</div>

                    {/* Footer */}
                    <div className="flex flex-col-reverse justify-between gap-4 text-sm text-gray-500 sm:flex-col-reverse lg:flex-row lg:items-center lg:gap-0">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-green-600 hover:cursor-pointer">
                                <FaHeart className="h-4 w-4" />
                                <span>8 Helpful</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={toggleChildReplies}
                                    className="flex items-center gap-1 text-sm text-gray-500 hover:cursor-pointer"
                                    disabled={isLoading}
                                >
                                    <FaRegComment className="h-4 w-4" />
                                    {isLoading ? (
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
                                    ) : (
                                        <span>
                                            {childRepliesCount} {childRepliesCount <= 1 ? 'Reply' : 'Replies'}
                                        </span>
                                    )}
                                </button>

                                {user ? (
                                    <button
                                        onClick={() => handleToggleReplyForm(!showReplyForm)}
                                        className="flex items-center gap-1 text-orange-500 hover:cursor-pointer"
                                    >
                                        <FaReply className="h-4 w-4" />
                                        Reply
                                    </button>
                                ) : (
                                    <a href={`/auth/signin?redirect=${encodeURIComponent(redirectUrl)}`}>
                                        <button className="flex items-center gap-1 text-orange-500 hover:cursor-pointer">
                                            <FaReply className="h-4 w-4" />
                                            Reply
                                        </button>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="flex items-start space-x-4 rounded-lg bg-white p-6 shadow-xl">
                    <UserAvatar imageUrl={reply.user.image} firstName={reply.user.firstName} lastName={reply.user.lastName} />
                    <div className="flex-grow space-y-2">
                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{`${reply.user.firstName} ${reply.user.lastName}`}</span>
                                <span
                                    className={`${titleColorMap[reply.user?.title ?? 'default']?.bgColor} ${
                                        titleColorMap[reply.user?.title ?? 'default']?.textColor
                                    } rounded-full px-2.5 py-0.5 text-xs font-normal`}
                                >
                                    {reply.user.title}
                                </span>
                            </div>
                            <span className="text-sm text-gray-500">{timeAgo(reply.createdAt)}</span>
                        </div>
                        <div className="text-gray-700">{parse(reply.content)}</div>
                        <div className="mt-2 flex items-center gap-4">
                            <button
                                onClick={toggleChildReplies}
                                className="flex items-center gap-1 text-sm text-gray-500 hover:cursor-pointer"
                                disabled={isLoading}
                            >
                                <FaRegComment className="h-4 w-4" />
                                {isLoading ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
                                ) : (
                                    <span>
                                        {childRepliesCount} {childRepliesCount <= 1 ? 'Reply' : 'Replies'}
                                    </span>
                                )}
                            </button>

                            {user ? (
                                <button onClick={() => handleToggleReplyForm(!showReplyForm)} className="flex items-center text-sm text-orange-500">
                                    <FaReply className="mr-2 h-4 w-4" />
                                    Reply
                                </button>
                            ) : (
                                <a href={`/auth/signin?redirect=${encodeURIComponent(redirectUrl)}`}>
                                    <button className="flex items-center text-sm text-orange-500">
                                        <FaReply className="mr-2 h-4 w-4" />
                                        Reply
                                    </button>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div style={{ marginLeft: level === 0 ? '0px' : level === 1 ? '4px' : '6px' }} className="mt-3">
            {renderReplyContent()}

            {showReplyForm && user && (
                <div className="mt-3 ml-2">
                    <ReplyForm
                        questionId={questionId}
                        user={user}
                        parentId={reply.id}
                        onSubmitSuccess={() => {
                            setShowReplyForm(false);
                            setOpenReplyFormId(null);
                            updateChildCount();
                            if (isChildRepliesLoaded) {
                                handleLoadChildReplies();
                            }
                        }}
                    />
                </div>
            )}

            {isChildRepliesLoaded && childReplies.length > 0 && (
                <div className="space-y-2">
                    <div className="ml-2 border-l border-gray-200 pl-1">
                        {childReplies.map((childReply) => (
                            <ReplyItem
                                key={childReply.id}
                                reply={childReply}
                                questionId={questionId}
                                level={level + 1}
                                initialChildCount={0}
                                user={user}
                            />
                        ))}
                        {hasMore && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLoadChildReplies}
                                className="mt-4 flex items-center space-x-2 text-orange-500"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-transparent" />
                                ) : null}
                                <span>Load More Replies</span>
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
