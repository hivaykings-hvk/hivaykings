import heroImage from '@/assets/images/hero.png';

import hvkPhoto from '@/assets/images/about-us/hvk-image.jpg';
import { ReactQueryProvider } from '@/Components/HvkChowk/react-query-provider';
import Link from '@/Components/Link';
import UserAvatar from '@/Components/UserAvatar';
import RootLayout from '@/Layouts/RootLayout';
import { timeAgo } from '@/lib/time-functions';
import { usePage } from '@inertiajs/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useMemo } from 'react';
import { FaStar } from 'react-icons/fa';
import { FaBookOpen, FaComment, FaCompass, FaRoute, FaUserTie } from 'react-icons/fa6'; // Grouped imports for clarity

const features = [
    {
        icon: FaCompass,
        title: 'Route Advice',
        description: 'Expert Guidance',
    },
    {
        icon: FaRoute,
        title: 'Road Trips',
        description: 'Epic Journeys Shared',
    },
    {
        icon: FaBookOpen,
        title: 'Road Stories',
        description: 'Inspiring post by community',
    },
    {
        icon: FaStar,
        title: 'Road Ratings',
        description: 'Honest reviews of highways',
    },
    {
        icon: FaUserTie,
        title: 'HVK',
        description: 'Human GPS aka Kumar HV',
    },
];

function Home() {
    const { auth } = usePage().props;
    const isLoggedIn = auth?.user;

    const { data: questionsData, isLoading: questionsLoading } = useQuery({
        queryKey: ['home-questions'],
        queryFn: async () => {
            const response = await axios.get('/api/questions', {
                params: {
                    offset: 0,
                    limit: 4,
                    sort: 'trending',
                },
            });
            return response.data.data || [];
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });

    const { data: roadRatingsData, isLoading: roadRatingsLoading } = useQuery({
        queryKey: ['home-road-ratings'],
        queryFn: async () => {
            const response = await axios.get('/api/road-ratings', {
                params: {
                    page: 1,
                    limit: 3,
                },
            });
            return response.data.data || [];
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });

    const { data: roadRatingDetails } = useQuery({
        queryKey: ['home-road-rating-details', roadRatingsData],
        queryFn: async () => {
            if (!roadRatingsData || roadRatingsData.length === 0) return {};

            const detailsMap: any = {};
            const detailPromises = roadRatingsData.map((rating: any) =>
                axios
                    .get(`/api/road-ratings/${rating.id}`)
                    .then((res) => {
                        detailsMap[rating.id] = res.data.data;
                    })
                    .catch(() => {
                        detailsMap[rating.id] = null;
                    }),
            );

            await Promise.all(detailPromises);
            return detailsMap;
        },
        enabled: Boolean(roadRatingsData && roadRatingsData.length > 0),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });

    const { data: traveloguesData, isLoading: traveloguesLoading } = useQuery({
        queryKey: ['home-travelogues'],
        queryFn: async () => {
            const response = await axios.get('/api/travelogues', {
                params: {
                    skip: 0,
                    limit: 3,
                },
            });
            return response.data.travelogues || [];
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });

    const questions = useMemo(() => questionsData || [], [questionsData]);
    const roadRatings = useMemo(() => roadRatingsData || [], [roadRatingsData]);
    const detailsMap = useMemo(() => roadRatingDetails || {}, [roadRatingDetails]);
    const travelogues = useMemo(() => traveloguesData || [], [traveloguesData]);

    return (
        <>
            {/* <!-- Hero Section --> */}
            <div
                className="-mt-[75px] min-h-[550px] bg-neutral-700 bg-cover bg-center bg-blend-overlay md:min-h-[650px]"
                style={{ backgroundImage: `url(${heroImage})` }}
            >
                <div className="container mx-auto px-3">
                    <div className="mx-auto flex flex-col items-start py-12 md:py-20">
                        <h1 className="pt-20 text-4xl font-medium text-white md:text-5xl">
                            Your Co-pilot for <br />
                            <span className="text-primary">every journey</span>
                        </h1>
                        <p className="md:text-md mt-8 text-sm text-gray-200">When you travel we travel with you.</p>
                        <div className="mt-16 flex gap-6 md:flex-row">
                            <a href={isLoggedIn ? '/road-ratings' : '/auth/signup'} className="text-md rounded-lg bg-primary px-6 py-3 md:text-xl">
                                {isLoggedIn ? 'Explore Roads' : 'Join the Tribe'}
                            </a>
                            <a href="/hvk-chowk" className="text-md rounded-lg border border-primary px-6 py-3 text-primary md:text-xl">
                                Ask HVK
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            {/*<!-- Hero section end --> */}

            {/* <!-- Feature section --> */}
            <div className="">
                <div className="container mx-auto px-4 py-8">
                    <div className="py-8 text-center text-2xl text-gray-800">What Makes Us Special</div>
                </div>

                <div className="container mx-auto pb-8">
                    <div className="flex flex-col items-center justify-between md:flex-row md:space-x-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="mb-8 flex flex-1 flex-grow flex-col rounded-xl bg-bgLightGray px-4 py-8 text-center">
                                    <div className="w-fit self-center text-primary">
                                        <Icon className="h-10 w-10" />
                                    </div>
                                    <div className="mt-3 mb-2 font-medium text-gray-700">{feature.title}</div>
                                    <p className="text-sm text-zinc-600">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            {/* <!-- Feature section end --> */}

            {/* Ask HVK */}
            <div className="bg-grayishBg pt-16 pb-20">
                <div className="container mx-auto">
                    <div className="text-center text-2xl text-gray-800">Ask HVK - The Highway Guru</div>
                    <p className="pt-4 text-center text-xs text-gray-600">
                        A space where anyone can ask about road status, routes and trip planning.
                    </p>
                    <div className="mt-8 flex items-center justify-center px-3">
                        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
                            {questionsLoading ? (
                                <div className="col-span-2 text-center text-gray-500">Loading questions...</div>
                            ) : questions.length > 0 ? (
                                questions.map((question) => (
                                    <div
                                        key={question.id}
                                        className="max-w-96 rounded-lg border-l-4 border-primary bg-white py-4 pr-4 pl-8 shadow-sm"
                                    >
                                        <div className="text-sm text-gray-800">{question.subject}</div>
                                        <div className="mt-4 flex items-center gap-4">
                                            <div className="flex items-center gap-1">
                                                <FaComment className="h-3 w-3 text-gray-500" />{' '}
                                                <span className="text-xs text-gray-500">{question.commentsCount} Answers</span>
                                            </div>
                                            <div className="text-xs text-gray-500">{timeAgo(question.createdAt)}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 text-center text-gray-500">No questions available</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Ask HVK End */}

            {/* Live Highway & Route Ratings */}
            <div className="bg-white pt-10 pb-10">
                <div className="container mx-auto py-4">
                    <div className="pb-8 text-center text-2xl text-gray-800">Road Ratings - Know Before You Go</div>

                    <div className="mx-4">
                        <div className="my-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {roadRatingsLoading ? (
                                <div className="col-span-3 text-center text-gray-500">Loading road ratings...</div>
                            ) : roadRatings.length > 0 ? (
                                roadRatings.map((rating: any) => {
                                    const detail = detailsMap[rating.id];
                                    const communityRating = detail?.communityRating || {};

                                    return (
                                        <div key={rating.id} className="w-full rounded-xl border border-none bg-bgLightGray px-6 py-6">
                                            <div className="flex items-start justify-between pt-2">
                                                <div className="text-md font-medium">
                                                    {rating.fromCity} → {rating.toCity}{' '}
                                                    {rating.highwayNumber ? `(${rating.highwayNumber})` : 'Highway'}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="font-medium text-primary">{rating.averageRating?.toFixed(1)}</div>
                                                    <div className="items-center-gap-1 flex">
                                                        <FaStar className="h-4 w-4 text-primary" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col pt-3">
                                                <div className="flex items-center justify-between pt-2">
                                                    <div className="text-xs text-zinc-800">Road Condition</div>
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar
                                                                key={i}
                                                                className={`h-4 w-4 ${
                                                                    i < Math.round(communityRating?.roadCondition || 0)
                                                                        ? 'text-primary'
                                                                        : 'text-gray-300'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-2">
                                                    <div className="text-xs text-zinc-800">Traffic</div>
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar
                                                                key={i}
                                                                className={`h-4 w-4 ${
                                                                    i < Math.round(communityRating?.traffic || 0) ? 'text-primary' : 'text-gray-300'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-2">
                                                    <div className="text-xs text-zinc-800">Facilities</div>
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar
                                                                key={i}
                                                                className={`h-4 w-4 ${
                                                                    i < Math.round(communityRating?.facilities || 0)
                                                                        ? 'text-primary'
                                                                        : 'text-gray-300'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-2">
                                                    <div className="text-xs text-zinc-800">Safety Index</div>
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar
                                                                key={i}
                                                                className={`h-4 w-4 ${
                                                                    i < Math.round(communityRating?.safetyIndex || 0)
                                                                        ? 'text-primary'
                                                                        : 'text-gray-300'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-2">
                                                    <div className="text-xs text-zinc-800">Scenic Value</div>
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar
                                                                key={i}
                                                                className={`h-4 w-4 ${
                                                                    i < Math.round(communityRating?.scenicValue || 0)
                                                                        ? 'text-primary'
                                                                        : 'text-gray-300'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="col-span-3 text-center text-gray-500">No road ratings available</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Live Highway & Route Ratings End */}

            {/* Live Road Updates */}
            <div className="bg-grayishBg pt-10 pb-16">
                <div className="mx-auto max-w-6xl">
                    <h2 className="mb-12 text-center text-2xl font-normal text-gray-800">About HVK</h2>
                    <div className="flex flex-col items-start gap-8 md:flex-row">
                        {/* Image */}
                        <div className="flex h-96 w-full flex-1 items-center justify-center rounded-lg">
                            <img src={hvkPhoto} alt="HVK Photo" className="h-full w-fit rounded-lg object-cover" />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <p className="mb-6 text-base text-gray-700">
                                HV Kumar, born in 1963 in Mumbai, is a qualified Chartered Accountant and Company Secretary with decades of
                                professional consulting experience. But beyond his corporate credentials lies a passionate road traveler who has
                                transformed his love for highways into a mission to help fellow travelers.
                            </p>
                            <p className="mb-6 text-base text-gray-700">
                                Since 1986, Kumar has meticulously logged over <span className="font-semibold text-primary">800,000 kilometers</span>{' '}
                                across Indian roads, documenting routes, fuel stops, road conditions, and scenic spots. His journey began with a
                                simple love for exploration but evolved into something much greater— becoming India's most trusted "Human GPS."
                            </p>
                            <div className="rounded-r-md border-l-4 border-primary bg-gray-50 py-2 pl-4">
                                <p className="text-gray-800 italic">
                                    "What started as personal travel logs became a calling to help others navigate India's vast highway network with
                                    confidence and safety."
                                </p>
                            </div>
                            <div className="mt-3">
                                <Link href="/about" className="text-primary hover:underline hover:underline-offset-4">
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Live Road Updates End */}

            {/* <!-- Road Stories Section --> */}
            <div className="bg-white py-10 pb-20">
                <div className="container mx-auto">
                    <div className="text-center text-2xl">Road Stories</div>

                    {/* <!-- Featured travelogues stories --> */}

                    <div className="mx-4 flex items-center justify-between pt-10">
                        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {traveloguesLoading ? (
                                <div className="col-span-3 text-center text-gray-500">Loading road stories...</div>
                            ) : travelogues.length > 0 ? (
                                travelogues.map((travelogue: any) => {
                                    const author = `${travelogue.user?.firstName} ${travelogue.user?.lastName}`;
                                    const image = travelogue.images && travelogue.images.length > 0 ? travelogue.images[0] : null;

                                    return (
                                        <div
                                            key={travelogue.id}
                                            className="flex h-full w-full flex-col overflow-x-hidden rounded-lg border border-none bg-white shadow-lg"
                                        >
                                            <div
                                                className="min-h-[200px] w-full bg-cover bg-center"
                                                style={{ backgroundImage: `url(${image ? '/storage/' + image : 'placeholder'})` }}
                                            ></div>
                                            <div className="my-4 flex-grow px-4">
                                                <div className="text-lg font-semibold">{travelogue.title}</div>
                                                <p className="mt-3 text-zinc-600">
                                                    {travelogue.content?.replace(/<[^>]*>/g, '').substring(0, 100)}...
                                                </p>
                                            </div>
                                            <div className="mt-4 flex items-center justify-between p-4">
                                                <div className="flex items-center gap-2">
                                                    <UserAvatar
                                                        imageUrl={travelogue.user?.image}
                                                        firstName={travelogue.user?.firstName}
                                                        lastName={travelogue.user?.lastName}
                                                    />
                                                    <div className="text-sm text-gray-500">{author}</div>
                                                </div>
                                                <div className="text-medium font-normal text-primary">
                                                    <a href={`/travelogue/${travelogue.id}`}>Read More</a>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="col-span-3 text-center text-gray-500">No road stories available</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- Road Stories Section end --> */}

            <div className="bg-bgNavBarBlack py-16">
                <div className="container mx-auto">
                    <div className="px-4 text-center text-xl font-medium text-gray-100">
                        {`"HiVayKings isn't just a community, its a family where every`} <br />{' '}
                        {` road leads to new frendships and unforgettable adventures."`}
                    </div>
                    <div className="pt-8 text-center text-sm text-primary italic">- Rahul Sharma, Member since 2022</div>
                </div>
            </div>
        </>
    );
}

Home.layout = function (page: React.ReactNode) {
    return (
        <RootLayout>
            <ReactQueryProvider>{page}</ReactQueryProvider>
        </RootLayout>
    );
};

export default Home;
