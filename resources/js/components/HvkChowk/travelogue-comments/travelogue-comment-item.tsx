'use client';

import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/UserAvatar';
import { timeAgo } from '@/lib/time-functions';
import { titleColorMap } from '@/lib/title-color-map';
import { User } from '@/types';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import clsx from 'clsx';
import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import { FaFlag, FaReply } from 'react-icons/fa';
import { FaRegComment, FaRegFlag } from 'react-icons/fa6';
import { toast } from 'sonner';
import { useTravelogueCommentContext } from './travelogue-comment-context';
import TravelogueCommentForm from './travelogue-comment-form';

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

interface TravelogueCommentItemProps {
    comment: Comment;
    travelogueId: string;
    level?: number;
    initialChildCount: number;
    user: User | null;
    onCommentSubmitted?: () => void;
}

const CHILD_COMMENTS_PER_PAGE = 5;

export default function TravelogueCommentItem({
    comment,
    travelogueId,
    level = 0,
    initialChildCount,
    user,
    onCommentSubmitted,
}: TravelogueCommentItemProps) {
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [childComments, setChildComments] = useState<Comment[]>([]);
    const [childCommentsCount, setChildCommentsCount] = useState<number>(initialChildCount);
    const [isChildCommentsLoaded, setIsChildCommentsLoaded] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState('');
    const [isReported, setIsReported] = useState(comment.abuseReported || false);
    const { openCommentFormId, setOpenCommentFormId } = useTravelogueCommentContext();

    const getCsrfToken = () => {
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        return token || '';
    };

    const reportMutation = useMutation({
        mutationFn: async () => {
            const response = await axios.post(
                `/api/travelogue-comments/${comment.id}/report`,
                {},
                {
                    headers: {
                        'X-CSRF-Token': getCsrfToken(),
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                },
            );
            return response.data;
        },
        onMutate: async () => {
            const previousReported = isReported;
            setIsReported(true);
            return { previousReported };
        },
        onSuccess: () => {
            setIsReported(true);
            toast.success('Comment reported successfully. Our team will review it.');
        },
        onError: (error: any, variables, context) => {
            if (context) {
                setIsReported(context.previousReported);
            }
            console.error('Error reporting comment:', error);
            if (error.response?.status === 401) {
                toast.error('Please login to report abuse');
            } else {
                toast.error('Failed to report comment. Please try again.');
            }
        },
    });

    useEffect(() => {
        // Close this form if another comment form is opened
        if (openCommentFormId && openCommentFormId !== comment.id && showCommentForm) {
            setShowCommentForm(false);
        }
        // Also close this form if openCommentFormId is null (user clicked travelogue reply button)
        if (openCommentFormId === null && showCommentForm) {
            setShowCommentForm(false);
        }
    }, [openCommentFormId]);

    useEffect(() => {
        if (initialChildCount === 0) {
            loadChildCommentsCount();
        }
        if (typeof window !== 'undefined') {
            setRedirectUrl(window.location.href);
        }
    }, [initialChildCount]);

    const loadChildCommentsCount = async () => {
        try {
            const response = await axios.get(`/api/travelogue-comments/${comment.id}/child-count`);
            setChildCommentsCount(response.data.count || 0);
        } catch (error) {
            console.error('Error loading child comments count:', error);
        }
    };

    const handleLoadChildComments = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/travelogue-comments/${comment.id}/children`, {
                params: { offset: offset, limit: CHILD_COMMENTS_PER_PAGE },
            });

            const data = response.data.data;
            const newComments = Array.isArray(data) ? data : data.comments || [];
            setChildComments((prev) => [...prev, ...newComments]);
            setOffset((prev) => prev + newComments.length);
            const total = Array.isArray(data) ? data.length : data.total || 0;
            setHasMore(offset + newComments.length < total);
            setIsChildCommentsLoaded(true);
        } catch (error) {
            console.error('Error loading child comments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleChildComments = () => {
        if (isChildCommentsLoaded) {
            setIsChildCommentsLoaded(false);
            setChildComments([]);
            setOffset(0);
        } else {
            handleLoadChildComments();
        }
    };

    const handleToggleCommentForm = (isOpen: boolean) => {
        setShowCommentForm(isOpen);
        if (isOpen) {
            setOpenCommentFormId(comment.id);
        } else {
            setOpenCommentFormId(null);
        }
    };

    const updateChildCount = async () => {
        await loadChildCommentsCount();
    };

    const handleReport = () => {
        if (!user) {
            toast.error('Please login to report abuse');
            return;
        }
        if (isReported) {
            toast.info('You have already reported this comment');
            return;
        }
        reportMutation.mutate();
    };

    const renderCommentContent = () => {
        return (
            <div className={clsx('rounded-lg bg-white p-6 shadow-xl')}>
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <UserAvatar imageUrl={comment.user.image} firstName={comment.user.firstName} lastName={comment.user.lastName} />
                        <div>
                            <div className="font-semibold text-gray-800">
                                {comment.user.firstName} {comment.user.lastName}
                            </div>
                            <span
                                className={`${titleColorMap[comment.user?.title ?? 'default']?.bgColor} ${
                                    titleColorMap[comment.user?.title ?? 'default']?.textColor
                                } rounded-full px-2.5 py-0.5 text-xs font-normal`}
                            >
                                {comment.user.title}
                            </span>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">{timeAgo(comment.createdAt)}</div>
                </div>

                {/* Content */}
                <div className="prose prose-sm mb-4 max-w-none text-gray-700">{parse(comment.content)}</div>

                {/* Footer - Actions */}
                <div className="flex flex-col-reverse justify-between gap-4 text-sm text-gray-500 sm:flex-col-reverse lg:flex-row lg:items-center lg:gap-0">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleChildComments}
                                className="flex items-center gap-1 text-sm text-gray-500 hover:cursor-pointer"
                                disabled={isLoading}
                            >
                                <FaRegComment className="h-4 w-4" />
                                {isLoading ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
                                ) : (
                                    <span>
                                        {childCommentsCount} {childCommentsCount <= 1 ? 'Reply' : 'Replies'}
                                    </span>
                                )}
                            </button>

                            {user ? (
                                <button
                                    onClick={() => handleToggleCommentForm(!showCommentForm)}
                                    className="flex items-center gap-1 text-orange-500 hover:cursor-pointer hover:text-orange-600"
                                >
                                    <FaReply className="h-4 w-4" />
                                    Reply
                                </button>
                            ) : (
                                <a href={`/auth/signin?redirect=${encodeURIComponent(redirectUrl)}`}>
                                    <button className="flex items-center gap-1 text-orange-500 hover:cursor-pointer hover:text-orange-600">
                                        <FaReply className="h-4 w-4" />
                                        Reply
                                    </button>
                                </a>
                            )}

                            <button
                                onClick={handleReport}
                                disabled={reportMutation.isPending || isReported}
                                className="flex items-center gap-1 transition-colors hover:cursor-pointer hover:text-red-600 disabled:opacity-50"
                                title={isReported ? 'You have reported this comment' : 'Report abuse'}
                            >
                                {isReported ? <FaFlag className="h-4 w-4 text-red-600" /> : <FaRegFlag className="h-4 w-4" />}
                                <span className="text-sm">{isReported ? 'Reported' : 'Report'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={{ marginLeft: level === 0 ? '0px' : level === 1 ? '4px' : '6px' }} className="mt-3">
            {renderCommentContent()}

            {showCommentForm && user && (
                <div className="mt-3 ml-2">
                    <TravelogueCommentForm
                        travelogueId={travelogueId}
                        user={user}
                        parentId={comment.id}
                        onSuccess={() => {
                            setShowCommentForm(false);
                            setOpenCommentFormId(null);
                            updateChildCount();
                            onCommentSubmitted?.();
                            if (isChildCommentsLoaded) {
                                handleLoadChildComments();
                            }
                        }}
                    />
                </div>
            )}

            {isChildCommentsLoaded && childComments.length > 0 && (
                <div className="space-y-2">
                    <div className="ml-2 border-l border-gray-200 pl-1">
                        {childComments.map((childComment) => (
                            <TravelogueCommentItem
                                key={childComment.id}
                                comment={childComment}
                                travelogueId={travelogueId}
                                level={level + 1}
                                initialChildCount={0}
                                user={user}
                                onCommentSubmitted={onCommentSubmitted}
                            />
                        ))}
                        {hasMore && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLoadChildComments}
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
