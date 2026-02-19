'use client';

import { ReactQueryProvider } from '@/Components/HvkChowk/react-query-provider';
import LoadingSpinner from '@/Components/spinner';
import { Button } from '@/Components/ui/button';
import UserAvatar from '@/Components/UserAvatar';
import { useAuth } from '@/hooks/useAuth';
import RootLayout from '@/Layouts/RootLayout';
import { Link, usePage } from '@inertiajs/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import parse, { DOMNode } from 'html-react-parser';
import { BookmarkIcon, ChevronLeft, Heart, MessageCircle, Pencil, Share2 } from 'lucide-react';
import { FaCalendarDay, FaImages, FaLocationDot, FaRoute, FaVideo } from 'react-icons/fa6';

interface PageProps {
    id: string;
}

interface TravelogueDetail {
    id: string;
    title: string;
    content: string;
    images?: string[];
    userId: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        title: string;
        image?: string;
    };
    createdAt: string;
    updatedAt: string;
    status: string;
}

function TravelogueDetailContent() {
    const page = usePage<PageProps>();
    const id = page.props.id;
    const { user } = useAuth();

    const {
        data: travelogue,
        isLoading,
        isError,
    } = useQuery<TravelogueDetail>({
        queryKey: ['travelogue', id],
        queryFn: async () => {
            const response = await axios.get(`/api/travelogues/${id}`);
            return response.data;
        },
        enabled: !!id,
    });

    if (isLoading) return <LoadingSpinner />;

    if (isError || !travelogue) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="mb-4 text-4xl font-bold text-gray-800">Travelogue Not Found</h1>
                    <p className="mb-6 text-gray-600">The travelogue you are looking for does not exist.</p>
                    <a href="/travelogue">
                        <Button className="bg-yellow-500 text-gray-900 hover:bg-yellow-600">
                            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Travelogues
                        </Button>
                    </a>
                </div>
            </div>
        );
    }

    const coverImage = travelogue.images?.[0] || '/placeholder-image.jpg';
    const authorFullName = `${travelogue.user.firstName} ${travelogue.user.lastName}`;
    const publishedDate = new Date(travelogue.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    const iconMap: { [key: string]: React.ElementType } = {
        facalendarday: FaCalendarDay,
        faimages: FaImages,
        favideo: FaVideo,
        falocationdot: FaLocationDot,
        faroute: FaRoute,
    };

    const options = {
        replace: (domNode: DOMNode) => {
            if ('name' in domNode && domNode.type === 'tag' && iconMap[domNode.name]) {
                const IconComponent = iconMap[domNode.name];
                const newAttribs = { ...domNode.attribs };
                if (newAttribs.classname) {
                    newAttribs.className = newAttribs.classname;
                    delete newAttribs.classname;
                }
                return (
                    <span className="inline-block">
                        <IconComponent {...newAttribs} />
                    </span>
                );
            }
            return domNode;
        },
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div
                className="relative min-h-96 bg-neutral-700 bg-cover bg-center bg-blend-overlay md:min-h-[550px]"
                style={{
                    backgroundImage: `url(${'/storage/' + coverImage})`,
                }}
            >
                <div className="absolute bottom-0 left-0 z-10 w-full p-8 text-white">
                    <h1 className="text-4xl leading-tight font-normal md:text-5xl">
                        {(() => {
                            const titleWords = travelogue.title.split(' ');
                            const midIndex = Math.ceil(titleWords.length / 2);
                            const firstHalfWords = titleWords.slice(0, midIndex).join(' ');
                            const secondHalfWords = titleWords.slice(midIndex).join(' ');
                            return (
                                <>
                                    <span>{firstHalfWords}</span>
                                    <span className="text-primary">&nbsp;{secondHalfWords}</span>
                                </>
                            );
                        })()}
                    </h1>
                </div>
            </div>

            {/* Author and Meta Info */}
            <div className="bg-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                        <div className="flex items-center space-x-4">
                            <UserAvatar imageUrl={travelogue.user.image} firstName={travelogue.user.firstName} lastName={travelogue.user.lastName} />
                            <div>
                                <p className="text-lg font-semibold text-gray-800">{authorFullName}</p>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                        {travelogue.user.title || 'Traveler'}
                                    </span>
                                    <span>Published: {publishedDate}</span>
                                </div>
                            </div>
                        </div>

                        {/* Engagement Icons and Buttons */}
                        <div className="flex flex-wrap items-center gap-2 space-x-4">
                            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-red-500">
                                <Heart className="h-5 w-5" />
                                <span>128</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-blue-500">
                                <MessageCircle className="h-5 w-5" />
                                <span>45</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-yellow-500">
                                <BookmarkIcon className="h-5 w-5" />
                                <span>Save</span>
                            </Button>
                            <Button className="bg-primary text-gray-800">Follow</Button>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <Share2 className="h-4 w-4" /> Share
                            </Button>
                            {user && user.id === travelogue?.userId && (
                                <Link href={`/travelogue/${id}/edit`}>
                                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                                        <Pencil className="h-4 w-4" /> Edit
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Travelogue Content */}
                    <div className="prose max-w-none">
                        <div>{parse(travelogue.content, options)}</div>
                    </div>
                </div>
            </div>

            {/* Back Button */}
            <div className="container mx-auto px-4 py-8">
                <a href="/travelogue">
                    <Button variant="outline" className="flex items-center gap-2">
                        <ChevronLeft className="h-4 w-4" /> Back to Travelogues
                    </Button>
                </a>
            </div>
        </div>
    );
}

export default function TravelogueDetailPage() {
    return (
        <ReactQueryProvider>
            <TravelogueDetailContent />
        </ReactQueryProvider>
    );
}

TravelogueDetailPage.layout = function (page: React.ReactNode) {
    return <RootLayout>{page}</RootLayout>;
};
