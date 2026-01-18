import { FaStar } from 'react-icons/fa';

interface RatingDisplayProps {
    label: string;
    rating: number;
    totalRatings?: number;
}

const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(<FaStar key={i} className={i <= Math.ceil(rating) ? 'text-yellow-500' : 'text-gray-300'} size={14} />);
    }
    return stars;
};

export default function RatingDisplay({ label, rating, totalRatings }: RatingDisplayProps) {
    return (
        <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
                <p className="font-semibold text-gray-700">{label}</p>
                <p className="text-sm text-gray-500">
                    {rating.toFixed(1)}/5 {totalRatings && `(${totalRatings})`}
                </p>
            </div>
            <div className="flex gap-1">{renderStars(rating)}</div>
        </div>
    );
}
