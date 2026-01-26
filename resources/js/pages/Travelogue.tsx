'use client';

import heroImage from '@/assets/images/hero.png';
import { ReactQueryProvider } from '@/Components/HvkChowk/react-query-provider';
import Link from '@/Components/Link';
import LoadingSpinner from '@/Components/spinner';
import { Button } from '@/Components/ui/button';
import UserAvatar from '@/Components/UserAvatar';
import RootLayout from '@/Layouts/RootLayout';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useRef } from 'react';

interface TravelogueCardData {
    id: string;
    title: string;
    content: string;
    images?: string[];
    user: {
        id: string;
        firstName: string;
        lastName: string;
        title: string;
        image?: string;
    };
    createdAt: string;
    updatedAt: string;
}

interface FeaturedStoryCardProps {
    travelogue: TravelogueCardData;
}

const FeaturedStoryCard = ({ travelogue }: FeaturedStoryCardProps) => {
    const { user, title, content, images } = travelogue;
    const image = images && images.length > 0 ? images[0] : '/placeholder-image.jpg';
    const author = `${user.firstName} ${user.lastName}`;
    const role = user.title || 'Traveler';

    // Truncate content to 150 characters
    const truncatedContent = content.replace(/<[^>]*>/g, '').substring(0, 150) + '...';

    return (
        <a href={`/travelogue/${travelogue.id}`} className="flex transform cursor-pointer flex-col overflow-hidden rounded-lg bg-white shadow-lg">
            <div
                className="h-60 w-full bg-cover bg-center"
                style={{
                    backgroundImage: `url(${'/storage/' + image})`,
                }}
            ></div>

            <div className="flex flex-grow flex-col justify-between p-4">
                <div>
                    <div className="mb-3 flex items-center">
                        <UserAvatar imageUrl={user.image} firstName={user.firstName} lastName={user.lastName} />
                        <span className="text-sm font-semibold text-gray-800">{author}</span>
                        <span
                            className={`ml-2 rounded-full px-2 py-1 text-xs font-medium ${
                                role === 'Explorer'
                                    ? 'bg-green-100 text-green-800'
                                    : role === 'Guru'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                            {role}
                        </span>
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900">{title}</h3>
                    <div className="line-clamp-3 text-sm text-gray-600">{truncatedContent}</div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                    <span className="mr-4 flex items-center">❤️ 0</span>
                    <span className="mr-4 flex items-center">💬 0</span>
                    <span className="flex items-center">🔖</span>
                </div>
            </div>
        </a>
    );
};

const TRAVELOGUES_PER_PAGE = 9;

const TravelogueContent = () => {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useInfiniteQuery({
        queryKey: ['travelogues'],
        queryFn: async ({ pageParam = 0 }) => {
            const response = await axios.get('/api/travelogues', {
                params: {
                    skip: pageParam,
                    limit: TRAVELOGUES_PER_PAGE,
                },
            });
            const { travelogues, total } = response.data;
            return { travelogues, total, nextPage: pageParam + TRAVELOGUES_PER_PAGE };
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            if (lastPage.nextPage < lastPage.total) {
                return lastPage.nextPage;
            }
            return undefined;
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
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

    const allTravelogues = data?.pages.flatMap((page) => page.travelogues) || [];
    const hasNoData = !isLoading && allTravelogues.length === 0;

    if (isError) {
        return <div className="m-4 text-sm text-red-500">Error: {error?.message}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h2 className="mb-8 text-3xl font-bold text-gray-800">Latest Stories</h2>

            {isLoading && <LoadingSpinner />}

            {hasNoData && <p className="text-center text-gray-600">No travelogues found. Be the first to create one!</p>}

            {allTravelogues.length > 0 && (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {allTravelogues.map((travelogue) => (
                        <FeaturedStoryCard key={travelogue.id} travelogue={travelogue} />
                    ))}
                </div>
            )}

            <div ref={observerTarget} className="h-1" />
            {isFetchingNextPage && <LoadingSpinner />}
            {!hasNextPage && allTravelogues.length > 0 && <div className="m-4 text-center text-xl text-gray-500">No more stories</div>}
        </div>
    );
};

function TraveloguePageContent() {
    return (
        <>
            <div className="relative h-84 w-full overflow-hidden md:h-[600px]">
                <div
                    className="h-full w-full bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${heroImage})`,
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                </div>
                <div className="absolute inset-0 z-10 flex h-full flex-col items-start justify-center p-8 text-white md:p-16 lg:p-24">
                    <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
                        Your Journey, <span className="text-primary">Your Story</span>
                    </h1>
                    <p className="mb-2 text-lg md:text-xl">Share it with the Tribe</p>
                    <p className="mb-8 max-w-xl text-base md:text-lg">
                        Post your road trip diaries, vlogs, videos, or destination stories to inspire fellow travelers.
                    </p>
                    <div className="flex space-x-4">
                        <Button className="rounded-full bg-primary px-6 py-3 text-lg font-semibold text-gray-800 hover:bg-primary">
                            <Link href="/travelogue/create" className="flex items-center">
                                <span className="mr-2 text-xl">+</span> Create a Story
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            className="rounded-full border-2 border-primary bg-transparent px-6 py-3 text-lg text-primary hover:bg-primary hover:text-gray-800"
                        >
                            <Link href="/travelogue" className="flex items-center">
                                Explore Stories
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            <TravelogueContent />
        </>
    );
}

export default function TraveloguePage() {
    return (
        <ReactQueryProvider>
            <TraveloguePageContent />
        </ReactQueryProvider>
    );
}

TraveloguePage.layout = function (page: React.ReactNode) {
    return <RootLayout>{page}</RootLayout>;
};
