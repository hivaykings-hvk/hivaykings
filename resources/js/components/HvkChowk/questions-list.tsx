'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useRef } from 'react';
import AskHvkCard from './ask-hvk-card';
import { useSort } from './sort-context';
import LoadingSpinner from './spinner';

const QUESTIONS_PER_PAGE = 10;

const QuestionsList = () => {
    const { sort } = useSort();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useInfiniteQuery({
        queryKey: ['questions', sort],
        queryFn: async ({ pageParam = 0 }) => {
            const response = await axios.get('/api/questions', {
                params: {
                    offset: pageParam,
                    limit: QUESTIONS_PER_PAGE,
                    sort: sort,
                },
            });
            console.log('Full response:', response);
            console.log('Response data:', response.data);
            const questions = response.data.data;
            console.log('Questions extracted:', questions);
            console.log('Questions count:', questions.length);
            return { questions, nextOffset: pageParam + QUESTIONS_PER_PAGE };
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            // If the number of returned questions is less than QUESTIONS_PER_PAGE, it's the last page
            if (lastPage.questions.length < QUESTIONS_PER_PAGE) {
                return undefined;
            }
            return lastPage.nextOffset;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });

    const observerTarget = useRef(null);

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

    const allQuestions = (data?.pages ?? []).flatMap((page) => page.questions ?? []);

    console.log('Data object:', data);
    console.log('Data pages:', data?.pages);
    console.log('All questions flattened:', allQuestions);
    console.log('All questions length:', allQuestions.length);

    return (
        <>
            {allQuestions.map((question) => (
                <AskHvkCard key={question.id} question={question} stats={{ views: question.views, replies: question.commentsCount }} />
            ))}
            <div ref={observerTarget} className="h-1" /> {/* Invisible target for observer */}
            {isFetchingNextPage && <LoadingSpinner />}
            {!hasNextPage && allQuestions.length > 0 && <div className="m-4 text-center text-xl text-gray-500">No more questions</div>}
            {allQuestions.length === 0 && !isLoading && (
                <div className="m-4 text-center text-lg text-gray-500">No questions available yet. Be the first to create one!</div>
            )}
        </>
    );
};

export default QuestionsList;
