'use client';

import { ReactQueryProvider } from '@/Components/HvkChowk/react-query-provider';
import LoadingSpinner from '@/Components/spinner';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Link } from '@inertiajs/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { FaMapMarkedAlt, FaMountain, FaRoute, FaShieldAlt, FaStar, FaUsers } from 'react-icons/fa';

interface RoadRating {
    id: string;
    fromCity: string;
    toCity: string;
    highwayNumber: string;
    description: string;
    distanceKm: number;
    travelTimeMin: number;
    image: string;
    region: string;
    chiefUser: {
        firstName: string;
        lastName: string;
        title: string;
        image: string;
    };
    averageRating: number;
    totalReviews: number;
    createdAt: string;
}

const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(<FaStar key={i} className={i <= Math.ceil(rating) ? 'text-yellow-500' : 'text-gray-300'} size={16} />);
    }
    return stars;
};

const RATINGS_PER_PAGE = 10;

function RoadRatingsContent() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('all');
    const [sortBy, setSortBy] = useState('recent');

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useInfiniteQuery({
        queryKey: ['road-ratings', selectedRegion, sortBy],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await axios.get('/api/road-ratings', {
                params: {
                    page: pageParam,
                    limit: RATINGS_PER_PAGE,
                    sort: sortBy,
                },
            });
            const roadRatings = response.data.data;
            return { roadRatings, nextPage: pageParam + 1 };
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.roadRatings.length < RATINGS_PER_PAGE) {
                return undefined;
            }
            return lastPage.nextPage;
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

    const allRatings = (data?.pages ?? []).flatMap((page) => page.roadRatings ?? []);

    const filteredRatings = allRatings.filter((rating: RoadRating) => {
        const searchMatch =
            rating.fromCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rating.toCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rating.highwayNumber.toLowerCase().includes(searchTerm.toLowerCase());

        const regionMatch = selectedRegion === 'all' || rating.region === selectedRegion;

        return searchMatch && regionMatch;
    });

    return (
        <>
            {/* Hero Section */}
            <div
                className="bg-cover bg-center py-16 opacity-90"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80)',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                }}
            >
                <div className="mx-auto flex h-full max-w-6xl flex-col items-start justify-center px-4 text-white lg:px-20">
                    <h1 className="mb-4 text-5xl font-normal md:text-6xl">
                        Road Ratings -{' '}
                        <span className="text-yellow-400">
                            Know <br />
                            Every Mile
                        </span>
                    </h1>
                    <p className="mb-8 max-w-2xl text-lg md:text-xl">
                        Explore trusted highway reviews, updated quarterly by HV Kumar (Chief), and powered by community experiences. Find the best
                        routes, track road conditions, and share your journey safely.
                    </p>
                    <Link href="/road-ratings/create">
                        <Button className="flex items-center space-x-2 rounded-lg bg-yellow-500 px-6 py-3 text-lg font-bold text-gray-900 hover:bg-yellow-600">
                            <FaRoute className="text-xl" />
                            <span>Create Rating</span>
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="container mx-auto flex flex-col items-center justify-between space-y-4 px-4 py-8 md:flex-row md:space-y-0 md:space-x-4">
                <div className="relative flex w-full flex-grow items-center md:w-auto">
                    <Input
                        type="text"
                        placeholder="Search by highway name or route..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg border py-2 pr-4 pl-10"
                    />
                </div>
                <div className="flex flex-wrap items-center justify-center space-x-2 md:justify-start">
                    <Button
                        onClick={() => setSelectedRegion('all')}
                        variant={selectedRegion === 'all' ? 'default' : 'outline'}
                        className="rounded-full px-4 py-2"
                    >
                        All Regions
                    </Button>
                    <Button
                        onClick={() => setSelectedRegion('north')}
                        variant={selectedRegion === 'north' ? 'default' : 'outline'}
                        className="rounded-full px-4 py-2"
                    >
                        North
                    </Button>
                    <Button
                        onClick={() => setSelectedRegion('south')}
                        variant={selectedRegion === 'south' ? 'default' : 'outline'}
                        className="rounded-full px-4 py-2"
                    >
                        South
                    </Button>
                    <Button
                        onClick={() => setSelectedRegion('east')}
                        variant={selectedRegion === 'east' ? 'default' : 'outline'}
                        className="rounded-full px-4 py-2"
                    >
                        East
                    </Button>
                    <Button
                        onClick={() => setSelectedRegion('west')}
                        variant={selectedRegion === 'west' ? 'default' : 'outline'}
                        className="rounded-full px-4 py-2"
                    >
                        West
                    </Button>
                </div>
            </div>

            {/* Featured Highways Section */}
            <div className="bg-gray-50">
                <section className="container mx-auto px-4 py-12">
                    <h2 className="mb-4 text-center text-4xl font-medium">Featured Highways</h2>
                    <p className="mb-10 text-center text-gray-600">Curated routes with verified ratings and community insights</p>

                    {isLoading ? (
                        <LoadingSpinner />
                    ) : isError ? (
                        <div className="m-4 text-sm text-red-500">Error: {error?.message}</div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {filteredRatings.map((rating: RoadRating) => (
                                    <Link key={rating.id} href={`/road-ratings/${rating.id}`}>
                                        <div className="cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg">
                                            <div
                                                className="h-60 w-full bg-cover bg-center"
                                                style={{
                                                    backgroundImage: `url(${process.env.VITE_OCI_BUCKET_BASE_URL}/${rating.image})`,
                                                }}
                                            ></div>
                                            <div className="px-4 py-6">
                                                <h3 className="mb-2 text-xl font-semibold">
                                                    {rating.fromCity} → {rating.toCity} Highway
                                                </h3>
                                                <p className="mt-2 mb-4 text-sm text-gray-600">
                                                    {rating.highwayNumber} - {rating.description?.slice(0, 70)}...
                                                </p>
                                                <div className="mt-4 flex flex-col items-start sm:justify-between xl:flex-row xl:items-center">
                                                    <div className="mb-2 flex items-center">
                                                        <span className="mr-2 text-sm font-medium">Average:</span>
                                                        <div className="flex gap-1">{renderStars(rating.averageRating)}</div>
                                                        <span className="ml-1 text-sm">{rating.averageRating.toFixed(1)}</span>
                                                    </div>
                                                </div>
                                                <p className="mb-4 text-xs text-gray-500">
                                                    Created by: {rating.chiefUser?.firstName} {rating.chiefUser?.lastName}
                                                </p>
                                                <Button className="w-full cursor-pointer rounded-lg bg-primary py-2 font-bold text-gray-900">
                                                    View Ratings
                                                </Button>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <div ref={observerTarget} className="h-1" />
                            {isFetchingNextPage && <LoadingSpinner />}
                            {!hasNextPage && filteredRatings.length > 0 && (
                                <div className="m-4 text-center text-xl text-gray-500">No more ratings</div>
                            )}
                            {filteredRatings.length === 0 && !isLoading && (
                                <div className="m-4 text-center text-lg text-gray-500">No ratings available</div>
                            )}
                        </>
                    )}
                </section>
            </div>

            {/* Why Road Ratings Matter Section */}
            <section className="container mx-auto px-4 py-12 text-center">
                <h2 className="mb-4 text-4xl font-bold text-gray-800">Why Road Ratings Matter</h2>
                <p className="mb-10 text-gray-600">Make informed decisions for safer, better journeys</p>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <div className="flex flex-col items-center p-4">
                        <div className="mb-4 rounded-full bg-yellow-500 p-4">
                            <FaShieldAlt className="text-3xl text-gray-800" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">Safety</h3>
                        <p className="text-center text-gray-600">
                            Plan trips with confidence using real-time updates and verified safety information.
                        </p>
                    </div>

                    <div className="flex flex-col items-center p-4">
                        <div className="mb-4 rounded-full bg-yellow-500 p-4">
                            <FaMapMarkedAlt className="text-3xl text-gray-800" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">Travel Planning</h3>
                        <p className="text-center text-gray-600">Find the best routes, stops, and travel conditions for your perfect road trip.</p>
                    </div>

                    <div className="flex flex-col items-center p-4">
                        <div className="mb-4 rounded-full bg-yellow-500 p-4">
                            <FaMountain className="text-3xl text-gray-800" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">Scenic Spots</h3>
                        <p className="text-center text-gray-600">Discover beautiful roads and hidden gems along your journey.</p>
                    </div>

                    <div className="flex flex-col items-center p-4">
                        <div className="mb-4 rounded-full bg-yellow-500 p-4">
                            <FaUsers className="text-3xl text-gray-800" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">Community</h3>
                        <p className="text-center text-gray-600">Share and learn from fellow road travelers in our trusted community.</p>
                    </div>
                </div>
            </section>

            {/* How Our Ratings Work Section */}
            <div className="bg-gray-50">
                <section className="container mx-auto px-4 py-12 text-center">
                    <h2 className="mb-4 text-4xl font-bold">How Our Ratings Work</h2>
                    <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500 text-xl font-bold text-gray-800">
                                1
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Chief Verification</h3>
                            <p className="text-gray-600">HV Kumar personally verifies and updates ratings every quarter based on ground reality.</p>
                        </div>

                        <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500 text-xl font-bold text-gray-800">
                                2
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Community Input</h3>
                            <p className="text-gray-600">Real experiences from our trusted community members add depth to every rating.</p>
                        </div>

                        <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500 text-xl font-bold text-gray-800">
                                3
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Live Updates</h3>
                            <p className="text-gray-600">Instant alerts for roadwork, closures, or maintenance keep you informed.</p>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default function RoadRatingsPage() {
    return (
        <ReactQueryProvider>
            <RoadRatingsContent />
        </ReactQueryProvider>
    );
}
