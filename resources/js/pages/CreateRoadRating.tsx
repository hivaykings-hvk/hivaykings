'use client';

import { ReactQueryProvider } from '@/Components/HvkChowk/react-query-provider';
import ImagePickerWithPreview from '@/Components/image-picker-with-preview';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const CreateRoadRatingFormSchema = z.object({
    fromCity: z.string().min(1, 'From city is required'),
    toCity: z.string().min(1, 'To city is required'),
    highwayNumber: z.string().min(1, 'Highway number is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    distanceKm: z.coerce.number().positive('Distance must be positive'),
    travelTimeMin: z.coerce.number().positive('Travel time must be positive'),
    region: z.enum(['north', 'south', 'east', 'west', 'central'], { message: 'Region is required' }),
    image: z.string().min(1, 'Image is required'),
});

type CreateRoadRatingFormData = z.infer<typeof CreateRoadRatingFormSchema>;

function CreateRoadRatingContent() {
    const [image, setImage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<CreateRoadRatingFormData>({
        resolver: zodResolver(CreateRoadRatingFormSchema),
    });

    const { mutate: createRating, isPending } = useMutation({
        mutationFn: async (data: CreateRoadRatingFormData) => {
            const transformedData = {
                from_city: data.fromCity,
                to_city: data.toCity,
                highway_number: data.highwayNumber,
                description: data.description,
                distance_km: data.distanceKm,
                travel_time_min: data.travelTimeMin,
                image: data.image,
                region: data.region,
            };
            const response = await axios.post('/api/road-ratings', transformedData);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success('Road rating created successfully!');
            router.visit(`/road-ratings/${data.data.id}`);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create road rating');
        },
    });

    const onSubmit = (data: CreateRoadRatingFormData) => {
        if (!image) {
            toast.error('Please upload an image');
            return;
        }
        createRating({ ...data, image });
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-12">
            <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-md">
                <h1 className="mb-2 text-4xl font-bold">Create Road Rating</h1>
                <p className="mb-8 text-gray-600">Help the community by sharing road information and insights</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Image Upload */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold">Road Image</label>
                        <ImagePickerWithPreview
                            onImageSelected={(base64) => {
                                setImage(base64);
                                setValue('image', base64);
                            }}
                        />
                        {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image.message}</p>}
                    </div>

                    {/* From City & To City */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 block text-sm font-semibold">From City</label>
                            <Input {...register('fromCity')} placeholder="e.g., New Delhi" />
                            {errors.fromCity && <p className="mt-1 text-sm text-red-500">{errors.fromCity.message}</p>}
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold">To City</label>
                            <Input {...register('toCity')} placeholder="e.g., Agra" />
                            {errors.toCity && <p className="mt-1 text-sm text-red-500">{errors.toCity.message}</p>}
                        </div>
                    </div>

                    {/* Highway Number & Region */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 block text-sm font-semibold">Highway Number</label>
                            <Input {...register('highwayNumber')} placeholder="e.g., NH-44" />
                            {errors.highwayNumber && <p className="mt-1 text-sm text-red-500">{errors.highwayNumber.message}</p>}
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold">Region</label>
                            <select {...register('region')} className="w-full rounded-lg border border-gray-300 px-3 py-2">
                                <option value="">Select Region</option>
                                <option value="north">North</option>
                                <option value="south">South</option>
                                <option value="east">East</option>
                                <option value="west">West</option>
                                <option value="central">Central</option>
                            </select>
                            {errors.region && <p className="mt-1 text-sm text-red-500">{errors.region.message}</p>}
                        </div>
                    </div>

                    {/* Distance & Travel Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 block text-sm font-semibold">Distance (km)</label>
                            <Input {...register('distanceKm')} type="number" placeholder="e.g., 200" />
                            {errors.distanceKm && <p className="mt-1 text-sm text-red-500">{errors.distanceKm.message}</p>}
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold">Travel Time (minutes)</label>
                            <Input {...register('travelTimeMin')} type="number" placeholder="e.g., 240" />
                            {errors.travelTimeMin && <p className="mt-1 text-sm text-red-500">{errors.travelTimeMin.message}</p>}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold">Description</label>
                        <Textarea {...register('description')} placeholder="Describe the road conditions, scenic spots, facilities, etc." rows={5} />
                        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <Button type="button" variant="outline" onClick={() => router.visit('/road-ratings')} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending || isSubmitting} className="flex-1 bg-yellow-500 text-gray-900 hover:bg-yellow-600">
                            {isPending || isSubmitting ? 'Creating...' : 'Create Road Rating'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function CreateRoadRatingPage() {
    return (
        <ReactQueryProvider>
            <CreateRoadRatingContent />
        </ReactQueryProvider>
    );
}
