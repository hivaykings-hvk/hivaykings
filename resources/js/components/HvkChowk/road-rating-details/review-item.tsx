'use client';

import UserAvatar from '@/Components/UserAvatar';
import { timeAgo } from '@/lib/time-functions';
import { titleColorMap } from '@/lib/title-color-map';
import { User } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import { FaFlag, FaRegComment, FaRegFlag, FaReply } from 'react-icons/fa';
import { toast } from 'sonner';
import ReviewForm from './review-form';
import { useReviewFormContext } from './review-form-context';

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

interface ReviewItemProps {
    comment: Comment;
    roadRatingId: string;
    level?: number;
    initialChildCount: number;
    user: User | null;
    onReviewSubmitted?: () => void;
}

const CHILD_COMMENTS_PER_PAGE = 5;

export function ReviewItem({ comment, roadRatingId, level = 0, initialChildCount, user, onReviewSubmitted }: ReviewItemProps) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [childComments, setChildComments] = useState<Comment[]>([]);
    const [childCommentsCount, setChildCommentsCount] = useState<number>(initialChildCount);
    const [isChildCommentsLoaded, setIsChildCommentsLoaded] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState('');
    const [isReported, setIsReported] = useState(comment.abuseReported || false);
    const { openReviewFormId, setOpenReviewFormId } = useReviewFormContext();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (openReviewFormId && openReviewFormId !== comment.id && showReplyForm) {
            setShowReplyForm(false);
        }
        if (openReviewFormId === null && showReplyForm) {
            setShowReplyForm(false);
        }
    }, [openReviewFormId, comment.id, showReplyForm]);

    useEffect(() => {
        if (initialChildCount === 0) {
            loadChildCommentsCount();
        }
        if (typeof window !== 'undefined') {
            setRedirectUrl(window.location.href);
        }
    }, [initialChildCount]);

    const getCsrfToken = () => {
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        return token || '';
    };

    const loadChildCommentsCount = async () => {
        try {
            const response = await axios.get(`/api/road-rating-comments/${comment.id}/child-count`);
            setChildCommentsCount(response.data.data.count || 0);
        } catch (error) {
            console.error('Error loading child comments count:', error);
        }
    };

    const handleLoadChildComments = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/road-rating-comments/${comment.id}/children`, {
                params: { offset: offset, limit: CHILD_COMMENTS_PER_PAGE },
            });

            const data = response.data.data;
            const newComments = data.comments || [];
            setChildComments((prev) => [...prev, ...newComments]);
            setOffset((prev) => prev + newComments.length);
            setHasMore(offset + newComments.length < (data.total || 0));
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

    const handleToggleReplyForm = (isOpen: boolean) => {
        setShowReplyForm(isOpen);
        if (isOpen) {
            setOpenReviewFormId(comment.id);
        } else {
            setOpenReviewFormId(null);
        }
    };

    const updateChildCount = async () => {
        await loadChildCommentsCount();
    };

    const reportMutation = useMutation({
        mutationFn: async () => {
            const response = await axios.post(
                `/api/road-rating-comments/${comment.id}/report`,
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

    return (
        <div style={{ marginLeft: level === 0 ? '0px' : level === 1 ? '4px' : '6px' }} className="mt-3">
            <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-start">
                    <UserAvatar imageUrl={comment.user.image} firstName={comment.user.firstName} lastName={comment.user.lastName} />
                    <div className="ml-3 flex-1">
                        <div className="flex items-center gap-2">
                            <div className="font-semibold text-gray-800">
                                {comment.user.firstName} {comment.user.lastName}
                            </div>
                            <div
                                className={`${comment.user.title && titleColorMap[comment.user.title]?.bgColor} ${
                                    comment.user.title && titleColorMap[comment.user.title]?.textColor
                                } rounded-[4px] px-2.5 py-0.5 text-xs font-normal`}
                            >
                                {comment.user.title}
                            </div>
                            <div className="text-sm text-gray-500">{timeAgo(comment.createdAt)}</div>
                        </div>
                        <div className="mt-2 text-gray-700">{parse(comment.content)}</div>
                        <div className="mt-2 flex items-center gap-4">
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

            {showReplyForm && user && (
                <div className="mt-3 ml-2">
                    <ReviewForm
                        roadRatingId={roadRatingId}
                        user={user}
                        parentId={comment.id}
                        onSubmitSuccess={() => {
                            setShowReplyForm(false);
                            setOpenReviewFormId(null);
                            updateChildCount();
                            onReviewSubmitted?.();
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
                            <ReviewItem
                                key={childComment.id}
                                comment={childComment}
                                roadRatingId={roadRatingId}
                                level={level + 1}
                                initialChildCount={0}
                                user={user}
                                onReviewSubmitted={onReviewSubmitted}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
