import { Star } from 'lucide-react';

interface Rating {
    roadCondition: number;
    traffic: number;
    facilities: number;
    safetyIndex: number;
    scenicValue: number;
}

interface CompareRatingsSectionProps {
    chiefRating: Rating;
    communityRating: Rating & { totalReviews?: number };
}

function StarRating({ rating, color = 'yellow' }: { rating: number; color?: 'yellow' | 'blue' }) {
    const stars = [];
    const colorClasses = {
        yellow: 'text-yellow-400',
        blue: 'text-blue-400',
    };

    for (let i = 0; i < 5; i++) {
        if (rating >= i + 1) {
            // Full star
            stars.push(<Star key={i} className={`h-5 w-5 fill-current ${colorClasses[color]}`} />);
        } else if (rating > i && rating < i + 1) {
            // Half star
            stars.push(
                <div key={i} className="relative h-5 w-5">
                    <Star className={`absolute h-5 w-5 ${colorClasses[color]}`} />
                    <div className="absolute top-0 left-0 h-5 w-2.5 overflow-hidden">
                        <Star className={`h-5 w-5 fill-current ${colorClasses[color]}`} />
                    </div>
                </div>,
            );
        } else {
            // Empty star
            stars.push(<Star key={i} className={`h-5 w-5 ${colorClasses[color]}`} />);
        }
    }

    return <div className="flex gap-1">{stars}</div>;
}

function RatingItem({ label, rating, color = 'yellow' }: { label: string; rating: number; color?: 'yellow' | 'blue' }) {
    const ratingPercentage = (rating / 5) * 100;
    return (
        <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <span className="font-semibold text-gray-800">{rating.toFixed(1)}</span>
            </div>
            <StarRating rating={rating} color={color} />
        </div>
    );
}

export default function CompareRatingsSection({ chiefRating, communityRating }: CompareRatingsSectionProps) {
    return (
        <div className="bg-white py-8">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h2 className="mb-6 text-3xl font-bold text-gray-800">Ratings Comparison</h2>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {/* Chief Ratings */}
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-8">
                            <h3 className="mb-2 text-2xl font-bold text-yellow-800">Chief's Ratings</h3>
                            <p className="mb-6 text-sm text-yellow-700">Verified by HvkChowk Chief</p>

                            <RatingItem label="Road Condition" rating={chiefRating.roadCondition} color="yellow" />
                            <RatingItem label="Traffic" rating={chiefRating.traffic} color="yellow" />
                            <RatingItem label="Facilities" rating={chiefRating.facilities} color="yellow" />
                            <RatingItem label="Safety Index" rating={chiefRating.safetyIndex} color="yellow" />
                            <RatingItem label="Scenic Value" rating={chiefRating.scenicValue} color="yellow" />
                        </div>

                        {/* Community Ratings */}
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-8">
                            <h3 className="mb-2 text-2xl font-bold text-blue-800">Community Ratings</h3>
                            <p className="mb-6 text-sm text-blue-700">Average from {communityRating.totalReviews || 0} travelers</p>

                            <RatingItem label="Road Condition" rating={communityRating.roadCondition} color="blue" />
                            <RatingItem label="Traffic" rating={communityRating.traffic} color="blue" />
                            <RatingItem label="Facilities" rating={communityRating.facilities} color="blue" />
                            <RatingItem label="Safety Index" rating={communityRating.safetyIndex} color="blue" />
                            <RatingItem label="Scenic Value" rating={communityRating.scenicValue} color="blue" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
