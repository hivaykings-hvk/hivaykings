'use client';

import { ReactQueryProvider } from '@/components/HvkChowk/react-query-provider';
import ImagePickerWithPreview from '@/components/image-picker-with-preview';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import RootLayout from '@/layouts/RootLayout';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CgSpinner } from 'react-icons/cg';
import { FaRoad, FaStar } from 'react-icons/fa6';
import { toast } from 'sonner';
import { z } from 'zod';

const CreateRoadRatingFormSchema = z.object({
    fromCity: z.string().min(1, 'From city is required'),
    toCity: z.string().min(1, 'To city is required'),
    highwayNumber: z.string().min(1, 'Highway number is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    distanceKm: z
        .string()
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Distance must be a positive number')
        .transform((val) => Number(val)),
    travelTimeMinInHours: z
        .string()
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Travel time must be a positive number')
        .transform((val) => Number(val)),
    region: z.enum(['north', 'south', 'east', 'west', 'central'], { message: 'Region is required' }),
    image: z.string().min(1, 'Image is required'),
});

type CreateRoadRatingFormData = z.infer<typeof CreateRoadRatingFormSchema>;

interface FileWithBase64 extends File {
    base64?: string;
}

function CreateRoadRatingContent() {
    const [imageFile, setImageFile] = useState<FileWithBase64 | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);

    const ratingForm = useForm<CreateRoadRatingFormData>({
        resolver: zodResolver(CreateRoadRatingFormSchema),
        defaultValues: {
            fromCity: '',
            toCity: '',
            highwayNumber: '',
            description: '',
            distanceKm: '' as unknown as number,
            travelTimeMinInHours: '' as unknown as number,
            region: 'north' as const,
            image: '',
        },
    });

    const createRatingMutation = useMutation({
        mutationFn: async (data: CreateRoadRatingFormData) => {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

            // Create FormData for multipart/form-data submission
            const formData = new FormData();
            formData.append('from_city', data.fromCity);
            formData.append('to_city', data.toCity);
            formData.append('highway_number', data.highwayNumber);
            formData.append('description', data.description);
            formData.append('distance_km', String(data.distanceKm));
            formData.append('travel_time_hours', String(data.travelTimeMinInHours));
            formData.append('region', data.region);

            // Append the image file
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const response = await axios.post('/api/road-ratings', formData, {
                headers: {
                    'X-CSRF-Token': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!response.status || response.status !== 201) {
                throw new Error(response.data?.message || 'Failed to create road rating');
            }

            return response.data;
        },
        onSuccess: (data) => {
            toast.success('Road rating created successfully!');
            ratingForm.reset();
            setImageFile(null);
            setImageBase64(null);
            router.visit(`/road-ratings/${data.data.id}`);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || error.message || 'Failed to create road rating');
        },
    });

    async function handleSubmit(values: CreateRoadRatingFormData) {
        if (!imageFile) {
            ratingForm.setError('image', {
                type: 'manual',
                message: 'Image is required',
            });
            return;
        }
        createRatingMutation.mutate(values);
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-12">
            <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-2xl">
                <div className="text-center">
                    <div className="mb-4 flex items-center justify-center gap-2">
                        <FaRoad className="h-6 w-6 text-primary md:h-8 md:w-8" />
                        <h2 className="text-xl font-bold text-gray-900 md:text-3xl">Create New Road Rating</h2>
                    </div>
                    <p className="mt-2 mb-12 text-center text-sm text-gray-600">Help the community by sharing road information and insights</p>
                </div>

                <Form {...ratingForm}>
                    <form onSubmit={ratingForm.handleSubmit(handleSubmit)} className="space-y-6">
                        {/* Image Upload */}
                        <FormField
                            control={ratingForm.control}
                            name="image"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Road Image</FormLabel>
                                    <FormControl>
                                        <ImagePickerWithPreview
                                            onImageSelected={(base64) => {
                                                // For display, use base64; for upload, use the file
                                                setImageBase64(base64);
                                                ratingForm.setValue('image', base64);
                                                ratingForm.clearErrors('image');
                                            }}
                                            onFileSelected={(file) => {
                                                setImageFile(file);
                                                ratingForm.setValue('image', file.name);
                                                ratingForm.clearErrors('image');
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        {/* From City & To City */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                                control={ratingForm.control}
                                name="fromCity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>From City</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="e.g., New Delhi"
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={ratingForm.control}
                                name="toCity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>To City</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="e.g., Agra"
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Highway Number & Region */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                                control={ratingForm.control}
                                name="highwayNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Highway Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="e.g., NH-44"
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={ratingForm.control}
                                name="region"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Region</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none">
                                                    <SelectValue placeholder="Select Region" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="north">North</SelectItem>
                                                <SelectItem value="south">South</SelectItem>
                                                <SelectItem value="east">East</SelectItem>
                                                <SelectItem value="west">West</SelectItem>
                                                <SelectItem value="central">Central</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Distance & Travel Time */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                                control={ratingForm.control}
                                name="distanceKm"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Distance (km)</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                placeholder="e.g., 200"
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={ratingForm.control}
                                name="travelTimeMinInHours"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Travel Time (Hours)</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                placeholder="e.g., 240"
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Description */}
                        <FormField
                            control={ratingForm.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Describe the road conditions, scenic spots, facilities, etc."
                                            rows={5}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={createRatingMutation.isPending}
                                className="group relative flex w-full flex-1 cursor-pointer items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-gray-800 shadow-sm"
                            >
                                {createRatingMutation.isPending ? (
                                    <div className="flex items-center justify-center">
                                        <FaStar className="mr-2 h-4 w-4 text-gray-800" />
                                        <p>Creating Rating</p>
                                        <CgSpinner className="ml-2 h-5 w-5 animate-spin text-gray-800" />
                                    </div>
                                ) : (
                                    <>
                                        <FaStar className="mr-2 h-4 w-4 text-gray-800" />
                                        Create Road Rating
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </Form>
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

CreateRoadRatingPage.layout = function (page: React.ReactNode) {
    return <RootLayout>{page}</RootLayout>;
};
