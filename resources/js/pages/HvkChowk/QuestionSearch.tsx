'use client';

import SearchBar from '@/components/HvkChowk/SearchBar';
import AskHvkCard from '@/components/HvkChowk/ask-hvk-card';
import FilterComponent from '@/components/HvkChowk/filter-component';
import { ReactQueryProvider } from '@/components/HvkChowk/react-query-provider';
import LoadingSpinner from '@/components/spinner';
import RootLayout from '@/Layouts/RootLayout';
import { getProcessedDescription } from '@/lib/html-truncate-util';
import { ChiefReply, RoadRating, SearchResponse } from '@/types/search';
import { Head, usePage } from '@inertiajs/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { FaCheckCircle, FaGasPump, FaRegStar, FaRoad, FaStar, FaUsers } from 'react-icons/fa';
import { MdAccessTime, MdDirectionsCar } from 'react-icons/md';

const QUESTIONS_PER_PAGE = 10;

const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
        stars.push(<FaStar key={`full-${i}`} className="h-4 w-4 text-gray-800" />);
    }

    if (hasHalfStar) {
        stars.push(<FaStar key="half" className="h-4 w-4 text-gray-800 opacity-50" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<FaRegStar key={`empty-${i}`} className="h-4 w-4 text-gray-800" />);
    }

    return stars;
};

const QuestionCard = ({ question, chiefReply }: { question?: string; chiefReply?: ChiefReply }) => {
    console.log('Rendering QuestionCard with chiefReply:', chiefReply);
    return (
        <div className="mx-auto my-8 rounded-lg bg-white p-6 shadow-xl">
            {chiefReply && Object.keys(chiefReply).length > 0 && (
                <>
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <span className="mr-2 flex items-center rounded-full bg-primary px-3 py-2 text-xs font-semibold text-gray-800">
                                <FaCheckCircle className="mr-2 h-3 w-3" />
                                Verified by HVK (Chief)
                            </span>
                            <span className="text-sm text-gray-600">
                                Answered by {chiefReply?.user?.firstName} {chiefReply?.user?.lastName}
                            </span>
                        </div>
                    </div>
                    <h2 className="mb-2 text-xl font-bold text-gray-800">{question}</h2>
                    <p className="mb-4 text-gray-700">{chiefReply?.content.substring(0, 200) || 'Loading...'}</p>
                </>
            )}

            {chiefReply?.questionId ? (
                <a
                    href={`/hvk-chowk/question/${chiefReply.questionId}`}
                    className="hover:bg-opacity-90 inline-block rounded bg-primary px-4 py-2 font-normal text-gray-800 transition-all"
                >
                    See Full Thread
                </a>
            ) : (
                <div className="inline-block rounded bg-primary px-3 py-1 text-sm text-gray-800">Chief Reply Not Available</div>
            )}
        </div>
    );
};

const QuestionSearchPageContent = () => {
    const { url } = usePage();
    const urlParams = new URLSearchParams(url.split('?')[1]);
    const initialQuery = urlParams.get('q') || '';

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [chiefReply, setChiefReply] = useState<ChiefReply | null>(null);
    const [chiefReplyQuestionSubject, setChiefReplyQuestionSubject] = useState<string>('');
    const [roadRating, setRoadRating] = useState<RoadRating | null>(null);
    const [roadRatingLoading, setRoadRatingLoading] = useState(false);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useInfiniteQuery({
        queryKey: ['searchResults', searchQuery],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await axios.get('/api/search', {
                params: {
                    q: searchQuery,
                    page: pageParam,
                },
            });
            return response.data as SearchResponse;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => {
            const totalFetched = pages.length * QUESTIONS_PER_PAGE;
            if (totalFetched < lastPage.total && lastPage.questionsWithUser.length === QUESTIONS_PER_PAGE) {
                return pages.length + 1;
            }
            return undefined;
        },
        enabled: !!searchQuery,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });

    const observerTarget = useRef(null);

    // Intersection observer for infinite scroll
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

    // Fetch chief replies when data changes
    useEffect(() => {
        const fetchChiefReply = async () => {
            const allSearchResults = data?.pages.flatMap((page) => page.questionsWithUser || []) || [];

            if (allSearchResults.length > 0) {
                const questionIds = allSearchResults.map((q) => q.id).join(',');
                try {
                    const response = await axios.get('/api/search/chief-reply', {
                        params: { ids: questionIds },
                    });

                    if (response.data) {
                        setChiefReply(response.data);
                        const foundQuestion = allSearchResults.find((q) => q.id === response.data.questionId);
                        setChiefReplyQuestionSubject(foundQuestion?.subject || '');
                    }
                } catch (err) {
                    console.error('Error fetching chief reply:', err);
                }
            }
        };

        fetchChiefReply();
    }, [data]);

    // Fetch road rating when search query changes
    useEffect(() => {
        const fetchRoadRating = async () => {
            if (searchQuery.trim()) {
                setRoadRatingLoading(true);
                try {
                    const response = await axios.get('/api/search/road-ratings', {
                        params: { q: searchQuery },
                    });

                    if (response.data) {
                        setRoadRating(response.data);
                    } else {
                        setRoadRating(null);
                    }
                } catch (error) {
                    console.error('Error fetching road rating:', error);
                    setRoadRating(null);
                } finally {
                    setRoadRatingLoading(false);
                }
            }
        };

        fetchRoadRating();
    }, [searchQuery]);

    const handleSearch = (query: string) => {
        setChiefReply(null);
        setChiefReplyQuestionSubject('');
        setSearchQuery(query);
    };

    if (isLoading) return <LoadingSpinner />;
    if (isError) return <div>Error: {error?.message}</div>;

    const allSearchResults = data?.pages.flatMap((page) => page.questionsWithUser || []) || [];

    return (
        <>
            <Head title="Question Search" />
            <SearchBar initialQuery={searchQuery} onSearch={handleSearch} />
            <div className="bg-gray-50">
                <div className="container mx-auto">
                    {chiefReply ? (
                        <QuestionCard question={chiefReplyQuestionSubject} chiefReply={chiefReply} />
                    ) : (
                        <QuestionCard question={searchQuery} />
                    )}

                    {allSearchResults.length > 0 ? (
                        <>
                            {/* People Also Ask Section */}
                            {allSearchResults.length > 0 && (
                                <div className="mx-auto my-8 py-6">
                                    <div className="mb-6 flex items-center gap-2">
                                        <FaUsers className="h-5 w-5 text-primary" />
                                        <h3 className="text-xl font-medium text-gray-800">People also ask</h3>
                                    </div>
                                    <div className="space-y-2">
                                        {allSearchResults.slice(0, 4).map((question) => (
                                            <details
                                                key={`faq-${question.id}`}
                                                className="group overflow-hidden rounded-lg border border-gray-200 transition-colors hover:border-gray-300"
                                            >
                                                <summary className="flex cursor-pointer items-center justify-between bg-white px-4 py-3 transition-colors hover:bg-gray-50">
                                                    <span className="text-sm font-medium text-gray-700 md:text-base">{question.subject}</span>
                                                    <span className="text-xl text-gray-400 transition-transform duration-200 group-open:rotate-45">
                                                        +
                                                    </span>
                                                </summary>
                                                <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
                                                    <p className="text-sm text-gray-600">
                                                        {getProcessedDescription(question.description, 200) || 'No description available.'}
                                                    </p>
                                                </div>
                                            </details>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Road Ratings and Highway Info Section */}
                            <div className="mx-auto my-8 grid grid-cols-1 gap-4 py-6 md:grid-cols-2">
                                {/* Road Ratings Card */}
                                {roadRatingLoading ? (
                                    <div className="flex items-center justify-center rounded-lg bg-white p-6 shadow-xl">
                                        <LoadingSpinner />
                                    </div>
                                ) : roadRating && roadRating.chiefRating ? (
                                    <div className="rounded-lg bg-white p-6 shadow-xl">
                                        <div className="mb-4 flex items-center gap-2">
                                            <FaRoad className="h-5 w-5 text-gray-800" />
                                            <h3 className="text-xl font-medium text-gray-800">
                                                Road Ratings: {roadRating.fromCity} → {roadRating.toCity}
                                            </h3>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-700">Road Condition</span>
                                                <div className="flex items-center">
                                                    {renderStars(roadRating.chiefRating.roadCondition)}
                                                    <span className="ml-2 font-semibold text-gray-800">
                                                        {roadRating.chiefRating.roadCondition.toFixed(1)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-700">Traffic</span>
                                                <div className="flex items-center">
                                                    {renderStars(roadRating.chiefRating.traffic)}
                                                    <span className="ml-2 font-semibold text-gray-800">
                                                        {roadRating.chiefRating.traffic.toFixed(1)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-700">Facilities</span>
                                                <div className="flex items-center">
                                                    {renderStars(roadRating.chiefRating.facilities)}
                                                    <span className="ml-2 font-semibold text-gray-800">
                                                        {roadRating.chiefRating.facilities.toFixed(1)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-700">Scenic</span>
                                                <div className="flex items-center">
                                                    {renderStars(roadRating.chiefRating.scenicValue)}
                                                    <span className="ml-2 font-semibold text-gray-800">
                                                        {roadRating.chiefRating.scenicValue.toFixed(1)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-700">Safety Index</span>
                                                <div className="flex items-center">
                                                    {renderStars(roadRating.chiefRating.safetyIndex)}
                                                    <span className="ml-2 font-semibold text-gray-800">
                                                        {roadRating.chiefRating.safetyIndex.toFixed(1)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}

                                {/* Highway Info Card */}
                                <div className="rounded-lg bg-white p-6 shadow-xl">
                                    <div className="mb-4 flex items-center gap-2">
                                        <FaGasPump className="h-5 w-5 text-gray-800" />
                                        <h3 className="text-xl font-medium text-gray-800">Highway Info</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {roadRating && (
                                            <>
                                                <div className="flex items-start gap-3">
                                                    <span className="rounded-full bg-purple-100 p-2">
                                                        <MdDirectionsCar className="h-4 w-4 text-purple-600" />
                                                    </span>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">Distance</p>
                                                        <p className="text-sm text-gray-600">{roadRating.distanceKm} km</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <span className="rounded-full bg-orange-100 p-2">
                                                        <MdAccessTime className="h-4 w-4 text-orange-600" />
                                                    </span>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">Travel Time</p>
                                                        <p className="text-sm text-gray-600">{roadRating.travelTimeMin} minutes</p>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <FilterComponent />

                            {/* AskHVKCard Section - Regular Questions */}
                            {allSearchResults.slice(1).map((question) => (
                                <AskHvkCard
                                    key={`community-${question.id}`}
                                    question={{
                                        ...question,
                                        createdAt: new Date(question.createdAt),
                                        updatedAt: new Date(question.updatedAt),
                                    }}
                                    stats={{
                                        views: question.viewsCount || 0,
                                        replies: question.commentsCount || 0,
                                    }}
                                />
                            ))}
                        </>
                    ) : (
                        <div className="py-8 text-center">No results found.</div>
                    )}

                    <div ref={observerTarget} className="h-1" />
                    {isFetchingNextPage && <LoadingSpinner />}
                    {!hasNextPage && allSearchResults.length > 0 && <div className="m-4 text-center text-xl text-gray-500">No more results</div>}
                </div>
            </div>
        </>
    );
};

export default function QuestionSearchPage() {
    return (
        <ReactQueryProvider>
            <QuestionSearchPageContent />
        </ReactQueryProvider>
    );
}

QuestionSearchPage.layout = function (page: React.ReactNode) {
    return <RootLayout>{page}</RootLayout>;
};
