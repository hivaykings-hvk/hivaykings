'use client';

import { Button } from '@/Components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

interface RoadRatingInputFormProps {
    roadRatingId: string;
}

export default function RoadRatingInputForm({ roadRatingId }: RoadRatingInputFormProps) {
    const queryClient = useQueryClient();
    const [ratings, setRatings] = useState({
        roadCondition: 0,
        traffic: 0,
        facilities: 0,
        safetyIndex: 0,
        scenicValue: 0,
    });

    const { mutate: submitRating, isPending } = useMutation({
        mutationFn: async () => {
            // Transform camelCase to snake_case for API
            const transformedData = {
                road_condition: ratings.roadCondition,
                traffic: ratings.traffic,
                facilities: ratings.facilities,
                safety_index: ratings.safetyIndex,
                scenic_value: ratings.scenicValue,
            };
            const response = await axios.post(`/api/road-ratings/${roadRatingId}/user-rating`, transformedData);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Thank you for rating this road!');
            setRatings({
                roadCondition: 0,
                traffic: 0,
                facilities: 0,
                safetyIndex: 0,
                scenicValue: 0,
            });
            queryClient.invalidateQueries({ queryKey: ['road-rating', roadRatingId] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to submit rating');
        },
    });

    const handleRatingChange = (field: string, value: number) => {
        setRatings((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const renderRatingStars = (field: string, value: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <button
                    key={i}
                    type="button"
                    onClick={() => handleRatingChange(field, i)}
                    className={`text-2xl transition-colors ${i <= value ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-300'}`}
                >
                    ★
                </button>,
            );
        }
        return stars;
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="mb-2 block text-sm font-semibold">Road Condition</label>
                <div className="flex gap-2">{renderRatingStars('roadCondition', ratings.roadCondition)}</div>
            </div>

            <div>
                <label className="mb-2 block text-sm font-semibold">Traffic Conditions</label>
                <div className="flex gap-2">{renderRatingStars('traffic', ratings.traffic)}</div>
            </div>

            <div>
                <label className="mb-2 block text-sm font-semibold">Facilities</label>
                <div className="flex gap-2">{renderRatingStars('facilities', ratings.facilities)}</div>
            </div>

            <div>
                <label className="mb-2 block text-sm font-semibold">Safety Index</label>
                <div className="flex gap-2">{renderRatingStars('safetyIndex', ratings.safetyIndex)}</div>
            </div>

            <div>
                <label className="mb-2 block text-sm font-semibold">Scenic Value</label>
                <div className="flex gap-2">{renderRatingStars('scenicValue', ratings.scenicValue)}</div>
            </div>

            <Button
                onClick={() => submitRating()}
                disabled={isPending || Object.values(ratings).some((r) => r === 0)}
                className="w-full bg-yellow-500 font-bold text-gray-900 hover:bg-yellow-600"
            >
                {isPending ? 'Submitting...' : 'Submit Rating'}
            </Button>
        </div>
    );
}
