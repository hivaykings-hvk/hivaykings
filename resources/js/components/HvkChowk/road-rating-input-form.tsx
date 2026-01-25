'use client';

import RichTextEditor from '@/Components/RichTextEditor';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Plus, Star } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface RoadRatingInputFormProps {
    roadRatingId: string;
}

const ratingCriteria = ['Road Condition', 'Traffic', 'Facilities', 'Safety Index', 'Scenic Value'];

const RoadRatingInputForm: React.FC<RoadRatingInputFormProps> = ({ roadRatingId }) => {
    const queryClient = useQueryClient();
    const [ratings, setRatings] = useState<Record<string, number>>({
        'Road Condition': 0,
        Traffic: 0,
        Facilities: 0,
        'Safety Index': 0,
        'Scenic Value': 0,
    });
    const [hoverRatings, setHoverRatings] = useState<Record<string, number>>({
        'Road Condition': 0,
        Traffic: 0,
        Facilities: 0,
        'Safety Index': 0,
        'Scenic Value': 0,
    });
    const [comment, setComment] = useState<string>('');

    const { mutate: submitRating, isPending } = useMutation({
        mutationFn: async () => {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

            // First, save the ratings
            const reviewData = {
                road_condition: ratings['Road Condition'],
                traffic: ratings['Traffic'],
                facilities: ratings['Facilities'],
                safety_index: ratings['Safety Index'],
                scenic_value: ratings['Scenic Value'],
            };

            const ratingResponse = await axios.post(`/api/road-ratings/${roadRatingId}/user-rating`, reviewData, {
                headers: {
                    'X-CSRF-Token': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            // Then, save the comment if it exists
            if (comment.trim()) {
                await axios.post(
                    `/api/road-ratings/${roadRatingId}/comments`,
                    { content: comment },
                    {
                        headers: {
                            'X-CSRF-Token': csrfToken,
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                    },
                );
            }

            return ratingResponse.data;
        },
        onSuccess: () => {
            toast.success('Rating submitted successfully!');
            setRatings({
                'Road Condition': 0,
                Traffic: 0,
                Facilities: 0,
                'Safety Index': 0,
                'Scenic Value': 0,
            });
            setComment('');
            queryClient.invalidateQueries({ queryKey: ['road-rating', roadRatingId] });
        },
        onError: (error: any) => {
            console.error('Error submitting rating:', error);
            toast.error(error.response?.data?.message || 'Failed to submit rating.');
        },
    });

    const handleStarClick = (criterion: string, rating: number) => {
        setRatings((prev) => ({ ...prev, [criterion]: rating }));
    };

    const handleStarHover = (criterion: string, rating: number) => {
        setHoverRatings((prev) => ({ ...prev, [criterion]: rating }));
    };

    const handleStarLeave = (criterion: string) => {
        setHoverRatings((prev) => ({ ...prev, [criterion]: 0 }));
    };

    const handleSubmit = () => {
        submitRating();
    };

    return (
        <div className="container mx-auto bg-white py-6 pb-12">
            <div className="flex-none items-center justify-center px-4 lg:flex">
                <div className="mt-8 rounded-lg border-t border-t-gray-100 p-6 shadow-xl lg:w-1/2">
                    <h2 className="mb-6 text-2xl font-bold">Rate This Highway</h2>

                    <div className="mb-8 grid grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-12">
                        {ratingCriteria.map((criterion) => (
                            <div key={criterion}>
                                <h3 className="mb-2 text-lg font-semibold">{criterion}</h3>
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`h-6 w-6 cursor-pointer ${
                                                (hoverRatings[criterion] || ratings[criterion]) >= star ? 'text-primary' : 'text-gray-300'
                                            }`}
                                            onClick={() => handleStarClick(criterion, star)}
                                            onMouseEnter={() => handleStarHover(criterion, star)}
                                            onMouseLeave={() => handleStarLeave(criterion)}
                                            fill={(hoverRatings[criterion] || ratings[criterion]) >= star ? 'currentColor' : 'none'}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mb-6">
                        <h3 className="mb-2 text-lg font-semibold">Comments</h3>
                        <RichTextEditor
                            content={comment}
                            onChange={(newContent) => setComment(newContent)}
                            placeholder="Share your experience or tips..."
                            menuItems={[
                                'paragraph',
                                'heading1',
                                'heading2',
                                'heading3',
                                'heading4',
                                'heading5',
                                'heading6',
                                'bold',
                                'italic',
                                'bulletList',
                                'link',
                                'image',
                                'blockquote',
                            ]}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="mt-12 flex items-center gap-2 bg-white text-gray-800 hover:bg-white"
                    >
                        <Plus className="h-6 w-6 font-semibold text-gray-800" />
                        <span className="text-md font-semibold hover:cursor-pointer">Add Your Rating</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoadRatingInputForm;
