import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import React from 'react';
import { FaCircleInfo, FaRegCircleQuestion, FaUsers } from 'react-icons/fa6';

interface User {
    id: number | string;
    firstName: string;
    lastName: string;
    title?: string;
    image?: string;
}

interface ChiefRatingItem {
    id: string;
    roadCondition: number;
    traffic: number;
    facilities: number;
    safetyIndex: number;
    scenicValue: number;
    user?: Partial<User>;
    createdAt?: string;
}

interface CompareRatingsSectionProps {
    chiefRating: {
        roadCondition: number;
        traffic: number;
        facilities: number;
        safetyIndex: number;
        scenicValue: number;
        chiefUser?: Partial<User>;
    };
    chiefRatings?: ChiefRatingItem[];
    communityRating: {
        totalReviews: number;
        roadCondition: number;
        traffic: number;
        facilities: number;
        safetyIndex: number;
        scenicValue: number;
    };
}

const StarRating = ({ rating, color }: { rating: number; color: string }) => {
    const validRating = Math.max(0, rating || 0); // Ensure rating is non-negative and defaults to 0
    const fullStars = Math.floor(validRating);
    const hasHalfStar = validRating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center">
            {[...Array(fullStars)].map((_, i) => (
                <Star key={`full-${i}`} className={`h-4 w-4 fill-current ${color}`} />
            ))}
            {hasHalfStar && (
                <Star
                    key="half"
                    className={`h-4 w-4 fill-current ${color}`}
                    style={{
                        clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)',
                    }}
                />
            )}
            {[...Array(emptyStars)].map((_, i) => (
                <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
            ))}
        </div>
    );
};

const RatingItem = ({ label, rating, color }: { label: string; rating: number; color: string }) => (
    <div className="flex items-center justify-between border-b border-gray-200 py-2 last:border-b-0">
        <span className="text-gray-700">{label}</span>
        <div className="flex items-center gap-2">
            <StarRating rating={rating} color={color} />
            <span className="font-semibold text-gray-800">{rating?.toFixed(1)}</span>
            <FaCircleInfo className="h-3 w-3 text-gray-400" />
        </div>
    </div>
);

const CompareRatingsSection: React.FC<CompareRatingsSectionProps> = ({ chiefRating, chiefRatings, communityRating }) => {
    const getImageUrl = (imagePath?: string) => {
        if (!imagePath) return '';
        return `/storage/${imagePath}`;
    };

    const renderChiefRatingCard = (rating: ChiefRatingItem | typeof chiefRating, index: number = 0, isMultiple: boolean = false) => (
        <div key={rating.id || index} className="w-full max-w-md rounded-lg bg-yellow-50 p-6 shadow-md">
            <div className="mb-6 flex items-center">
                <div className="mr-4 h-12 w-12 overflow-hidden rounded-full">
                    <Avatar className="h-full w-full bg-gray-100">
                        <AvatarImage
                            src={getImageUrl(('user' in rating ? rating.user?.image : rating.chiefUser?.image) as string)}
                            className="object-cover"
                        />
                        <AvatarFallback className="text-gray-800">
                            {(() => {
                                const firstName = ('user' in rating ? rating.user?.firstName : rating.chiefUser?.firstName) || '';
                                const lastName = ('user' in rating ? rating.user?.lastName : rating.chiefUser?.lastName) || '';
                                return `${firstName?.[0]}${lastName?.[0]}`;
                            })()}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-800">
                        {isMultiple
                            ? `${'user' in rating ? rating.user?.firstName : rating.chiefUser?.firstName} ${'user' in rating ? rating.user?.lastName : rating.chiefUser?.lastName}'s Rating`
                            : `Chief's Rating`}
                    </h3>
                    <p className="flex items-center text-sm text-gray-500">
                        <FaRegCircleQuestion className="mr-1 h-3 w-3" /> HVK Verified
                    </p>
                </div>
            </div>
            <div className="space-y-2">
                <RatingItem label="Road Condition" rating={rating.roadCondition} color="text-yellow-500" />
                <RatingItem label="Traffic" rating={rating.traffic} color="text-yellow-500" />
                <RatingItem label="Facilities" rating={rating.facilities} color="text-yellow-500" />
                <RatingItem label="Safety Index" rating={rating.safetyIndex} color="text-yellow-500" />
                <RatingItem label="Scenic Value" rating={rating.scenicValue} color="text-yellow-500" />
            </div>
        </div>
    );

    return (
        <div className="flex justify-center bg-gray-50">
            <section className="mt-12 w-full px-4 py-12">
                <h2 className="mb-8 text-center text-3xl font-bold">Compare Ratings</h2>
                <div className="flex flex-col flex-wrap items-center justify-center gap-8 lg:flex-row lg:items-start">
                    {/* Chief Rating(s) */}
                    {chiefRatings && chiefRatings.length > 0
                        ? chiefRatings.map((rating, index) => renderChiefRatingCard(rating, index, true))
                        : renderChiefRatingCard(chiefRating, 0, false)}

                    {/* Community Ratings Card */}
                    <div className="w-full max-w-md rounded-lg bg-blue-50 p-6 shadow-md">
                        <div className="mb-6 flex items-center">
                            <div className="mr-4 rounded-full bg-blue-200 p-3">
                                <FaUsers className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Community Ratings</h3>
                                <p className="flex items-center text-sm text-blue-600">
                                    <FaUsers className="mr-1 h-3 w-3" /> {communityRating.totalReviews.toLocaleString()} Reviews
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <RatingItem label="Road Condition" rating={communityRating.roadCondition} color="text-blue-500" />
                            <RatingItem label="Traffic" rating={communityRating.traffic} color="text-blue-500" />
                            <RatingItem label="Facilities" rating={communityRating.facilities} color="text-blue-500" />
                            <RatingItem label="Safety Index" rating={communityRating.safetyIndex} color="text-blue-500" />
                            <RatingItem label="Scenic Value" rating={communityRating.scenicValue} color="text-blue-500" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CompareRatingsSection;
