'use client';

import AdditionalInfoSection from '@/Components/HvkChowk/additional-info-section';
import CompareRatingsSection from '@/Components/HvkChowk/compare-ratings-section';
import { ReactQueryProvider } from '@/Components/HvkChowk/react-query-provider';
import ReviewForm from '@/Components/HvkChowk/road-rating-details/review-form';
import { ReviewFormProvider } from '@/Components/HvkChowk/road-rating-details/review-form-context';
import ReviewList from '@/Components/HvkChowk/road-rating-details/review-list';
import RoadRatingInputForm from '@/Components/HvkChowk/road-rating-input-form';
import LoadingSpinner from '@/Components/spinner';
import { Button } from '@/Components/ui/button';
import RootLayout from '@/Layouts/RootLayout';
import { useAuth } from '@/hooks/useAuth';
import { Link, usePage } from '@inertiajs/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Expand, Pencil, Plus, Share2 } from 'lucide-react';
import { FaCircleCheck } from 'react-icons/fa6';

interface RoadRating {
    id: string;
    fromCity: string;
    toCity: string;
    highwayNumber: string;
    description: string;
    distanceKm: number;
    travelTimeHours: number;
    image: string;
    region: string;
    chiefUser: {
        firstName: string;
        lastName: string;
        title: string;
        image: string;
    };
    chiefRating: {
        roadCondition: number;
        traffic: number;
        facilities: number;
        safetyIndex: number;
        scenicValue: number;
    };
    communityRating: {
        roadCondition: number;
        traffic: number;
        facilities: number;
        safetyIndex: number;
        scenicValue: number;
    };
    totalUserRatings: number;
    comments: Array<{
        id: string;
        user: {
            firstName: string;
            lastName: string;
            image: string;
        };
        content: string;
        createdAt: string;
    }>;
    createdAt: string;
}

interface PageProps {
    id: string;
}

function RoadRatingDetailContent() {
    const page = usePage<PageProps>();
    const roadId = page.props.id;
    const { user } = useAuth();

    const {
        data: roadRating,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['road-rating', roadId],
        queryFn: async () => {
            const response = await axios.get(`/api/road-ratings/${roadId}`);
            return response.data.data;
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });

    if (isLoading) return <LoadingSpinner />;
    if (isError || !roadRating) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="mb-4 text-4xl font-bold text-gray-800">Road Rating Not Found</h1>
                    <p className="mb-6 text-gray-600">{error?.message || 'This road rating does not exist'}</p>
                    <Link href="/road-ratings">
                        <Button className="bg-yellow-500 text-gray-900 hover:bg-yellow-600">Back to Road Ratings</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col-reverse gap-8 lg:flex-row lg:px-20">
                    {/* Left Section */}
                    <div className="flex-1">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center">
                            <h1 className="mb-2 text-4xl font-semibold text-gray-800">
                                {roadRating.fromCity} &rarr; {roadRating.toCity} Highway ({roadRating.highwayNumber})
                            </h1>
                            <div className="mb-4 inline-flex">
                                <FaCircleCheck className="mr-1 h-3 w-3 text-gray-800 md:h-5 md:w-5" />
                                <span className="text-[10px] font-semibold text-gray-800">
                                    Reviewed by {roadRating.chiefUser.firstName} {roadRating.chiefUser.lastName} (Chief)
                                </span>
                            </div>
                        </div>

                        <p className="mt-4 mb-6 text-lg text-gray-500">{roadRating.description}</p>

                        <div className="mb-6 flex justify-around gap-8">
                            <div>
                                <div className="text-2xl font-semibold text-gray-800">{roadRating.distanceKm} km</div>
                                <div className="text-gray-500">Distance</div>
                            </div>
                            <div>
                                <div className="text-2xl font-semibold text-gray-800">{roadRating.travelTimeHours} hours</div>
                                <div className="text-gray-500">Estimated Time</div>
                            </div>
                        </div>

                        <div className="mb-6 flex gap-4">
                            <Button variant="outline" className="flex items-center gap-2">
                                <Plus className="h-4 w-4" /> Follow Highway
                            </Button>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Share2 className="h-4 w-4" /> Share Highway
                            </Button>
                            {user && user.role === 'admin' && (
                                <Link href={`/road-ratings/${roadRating.id}/edit`}>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <Pencil className="h-4 w-4" /> Edit
                                    </Button>
                                </Link>
                            )}
                        </div>

                        <p className="text-sm text-gray-500">
                            Last updated:{' '}
                            {new Date(roadRating.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </p>
                    </div>

                    {/* Right Section - Image */}
                    <div
                        className="relative h-96 w-full overflow-hidden rounded-lg bg-cover bg-center shadow-lg lg:w-1/2"
                        style={{
                            backgroundImage: `url(${'/storage/' + roadRating.image})`,
                        }}
                    >
                        <Button variant="secondary" size="icon" className="absolute top-4 right-4 rounded-full">
                            <Expand className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            <CompareRatingsSection
                chiefRating={{
                    roadCondition: roadRating.chiefRating.roadCondition,
                    traffic: roadRating.chiefRating.traffic,
                    facilities: roadRating.chiefRating.facilities,
                    safetyIndex: roadRating.chiefRating.safetyIndex,
                    scenicValue: roadRating.chiefRating.scenicValue,
                }}
                communityRating={{
                    totalReviews: roadRating.totalUserRatings,
                    roadCondition: roadRating.communityRating.roadCondition,
                    traffic: roadRating.communityRating.traffic,
                    facilities: roadRating.communityRating.facilities,
                    safetyIndex: roadRating.communityRating.safetyIndex,
                    scenicValue: roadRating.communityRating.scenicValue,
                }}
            />

            <div className="bg-white">
                <RoadRatingInputForm roadRatingId={roadRating.id} />
            </div>

            <div className="bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-gray-800">Discussion & Experiences</h2>
                        <select className="rounded-md border p-2">
                            <option>Newest</option>
                            <option>Oldest</option>
                        </select>
                    </div>

                    <ReviewFormProvider>
                        {user && (
                            <div className="mb-6">
                                <ReviewForm roadRatingId={roadRating.id} user={user} />
                            </div>
                        )}

                        <ReviewList roadRatingId={roadRating.id} user={user || null} />
                    </ReviewFormProvider>
                </div>
            </div>

            <AdditionalInfoSection />
        </>
    );
}

export default function RoadRatingDetailPage() {
    return (
        <ReactQueryProvider>
            <RoadRatingDetailContent />
        </ReactQueryProvider>
    );
}

RoadRatingDetailPage.layout = function (page: React.ReactNode) {
    return <RootLayout>{page}</RootLayout>;
};
