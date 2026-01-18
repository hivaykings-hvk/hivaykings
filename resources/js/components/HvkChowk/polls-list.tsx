'use client';

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useRef } from 'react';
import PollCard from './poll-card';
import LoadingSpinner from './spinner';

const POLLS_PER_PAGE = parseInt(process.env.NEXT_PUBLIC_POLLS_PER_PAGE || '10', 10);

interface User {
    id: number | string;
    name?: string;
    email?: string;
    [key: string]: any;
}

interface PollOption {
    id: string;
    optionText: string;
    votes: number;
    user_voted?: boolean;
}

interface Poll {
    id: string;
    questionText: string;
    userId: string;
    tags?: string;
    description?: string;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
    user?: {
        firstName: string;
        lastName: string;
        title: string;
        image?: string;
    };
    options: PollOption[];
    totalVotes: number;
}

interface PollsListProps {
    user?: User | null;
}

const PollsList: React.FC<PollsListProps> = ({ user }) => {
    const queryClient = useQueryClient();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useInfiniteQuery({
        queryKey: ['polls'],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await axios.get('/api/polls', {
                params: {
                    page: pageParam,
                    limit: POLLS_PER_PAGE,
                },
            });
            console.log('Full poll response:', response);
            console.log('Poll response data:', response.data);
            const polls = response.data.data;
            console.log('Polls extracted:', polls);
            console.log('Polls count:', polls.length);
            return { polls, nextPage: pageParam + 1 };
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            // If the number of returned polls is less than POLLS_PER_PAGE, it's the last page
            if (lastPage.polls.length < POLLS_PER_PAGE) {
                return undefined;
            }
            return lastPage.nextPage;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });

    const observerTarget = useRef(null);

    const handleVoteSuccess = () => {
        // Invalidate the polls query to refetch data with updated vote counts
        queryClient.invalidateQueries({ queryKey: ['polls'] });
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 1 },
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isError) {
        return <div className="m-4 text-sm text-red-500">Error: {error?.message}</div>;
    }

    const allPolls = (data?.pages ?? []).flatMap((page) => page.polls ?? []);

    console.log('Data object:', data);
    console.log('Data pages:', data?.pages);
    console.log('All polls flattened:', allPolls);
    console.log('All polls length:', allPolls.length);

    return (
        <>
            {allPolls.map((poll: Poll) => (
                <PollCard
                    key={poll.id}
                    poll={poll}
                    options={poll.options}
                    totalVotes={poll.totalVotes}
                    onVoteSuccess={handleVoteSuccess}
                    user={user}
                />
            ))}
            <div ref={observerTarget} className="h-1" /> {/* Invisible target for observer */}
            {isFetchingNextPage && <LoadingSpinner />}
            {!hasNextPage && allPolls.length > 0 && <div className="m-4 text-center text-xl text-gray-500">No more polls</div>}
            {allPolls.length === 0 && !isLoading && (
                <div className="m-4 text-center text-lg text-gray-500">No polls available yet. Be the first to create one!</div>
            )}
        </>
    );
};

export default PollsList;
