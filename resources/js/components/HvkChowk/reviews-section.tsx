interface Review {
    id: string;
    user: {
        firstName: string;
        lastName: string;
        image: string;
    };
    content: string;
    createdAt: string;
}

interface ReviewsSectionProps {
    reviews: Review[];
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
};

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
    return (
        <div className="space-y-6">
            {reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-b-0">
                        <div className="flex gap-4">
                            <div
                                className="h-12 w-12 flex-shrink-0 rounded-full bg-cover bg-center"
                                style={{
                                    backgroundImage: `url(${process.env.VITE_OCI_BUCKET_BASE_URL}/${review.user.image})`,
                                }}
                            ></div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold">
                                        {review.user.firstName} {review.user.lastName}
                                    </p>
                                    <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                                </div>
                                <p className="mt-2 text-gray-700">{review.content}</p>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="py-8 text-center text-gray-500">
                    <p>No reviews yet. Be the first to share your experience!</p>
                </div>
            )}
        </div>
    );
}
