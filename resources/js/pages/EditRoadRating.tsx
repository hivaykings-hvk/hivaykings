'use client';

import { ReactQueryProvider } from '@/components/HvkChowk/react-query-provider';
import ImagePickerWithPreview from '@/components/image-picker-with-preview';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import RootLayout from '@/Layouts/RootLayout';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, usePage } from '@inertiajs/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CgSpinner } from 'react-icons/cg';
import { FaRoad, FaStar } from 'react-icons/fa6';
import { toast } from 'sonner';
import { z } from 'zod';

const EditRoadRatingFormSchema = z.object({
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
    image: z.string().optional(),
    deleteUserRatings: z.boolean().optional(),
    deleteComments: z.boolean().optional(),
});

type EditRoadRatingFormData = z.infer<typeof EditRoadRatingFormSchema>;

interface FileWithBase64 extends File {
    base64?: string;
}

interface RoadRatingData {
    id: string;
    fromCity: string;
    toCity: string;
    highwayNumber: string;
    description: string;
    distanceKm: number;
    travelTimeHours: number;
    image: string;
    region: string;
}

interface PageProps {
    id: string;
}

function EditRoadRatingContent({ id }: { id: string }) {
    const [imageFile, setImageFile] = useState<FileWithBase64 | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [existingImage, setExistingImage] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const ratingForm = useForm<EditRoadRatingFormData>({
        resolver: zodResolver(EditRoadRatingFormSchema),
        defaultValues: {
            fromCity: '',
            toCity: '',
            highwayNumber: '',
            description: '',
            distanceKm: '' as unknown as number,
            travelTimeMinInHours: '' as unknown as number,
            region: 'north' as const,
            image: '',
            deleteUserRatings: false,
            deleteComments: false,
        },
    });

    // Fetch existing road rating data
    const { data: ratingData, isLoading: isLoadingRating } = useQuery<{ data: RoadRatingData }>({
        queryKey: ['roadRating', id, 'edit'],
        queryFn: async () => {
            const response = await axios.get(`/api/road-ratings/${id}/edit`);
            return response.data;
        },
    });

    // Populate form when data is loaded
    useEffect(() => {
        if (ratingData?.data) {
            const rating = ratingData.data;
            ratingForm.reset({
                fromCity: rating.fromCity,
                toCity: rating.toCity,
                highwayNumber: rating.highwayNumber,
                description: rating.description,
                distanceKm: String(rating.distanceKm) as unknown as number,
                travelTimeMinInHours: String(rating.travelTimeHours) as unknown as number,
                region: rating.region as any,
                image: rating.image || '',
                deleteUserRatings: false,
                deleteComments: false,
            });
            setExistingImage(rating.image);
        }
    }, [ratingData, ratingForm]);

    const updateRatingMutation = useMutation({
        mutationFn: async (data: EditRoadRatingFormData) => {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

            // Create FormData for multipart/form-data submission
            const formData = new FormData();
            formData.append('_method', 'PUT');
            formData.append('from_city', data.fromCity);
            formData.append('to_city', data.toCity);
            formData.append('highway_number', data.highwayNumber);
            formData.append('description', data.description);
            formData.append('distance_km', String(data.distanceKm));
            formData.append('travel_time_hours', String(data.travelTimeMinInHours));
            formData.append('region', data.region);
            formData.append('delete_user_ratings', data.deleteUserRatings ? '1' : '0');
            formData.append('delete_comments', data.deleteComments ? '1' : '0');

            // Append the image file if a new one was selected
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const response = await axios.post(`/api/road-ratings/${id}`, formData, {
                headers: {
                    'X-CSRF-Token': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!response.status || response.status !== 200) {
                throw new Error(response.data?.message || 'Failed to update road rating');
            }

            return response.data;
        },
        onSuccess: (data) => {
            toast.success('Road rating updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['roadRating', id] });
            router.visit(`/road-ratings/${id}`);
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update road rating';
            toast.error(errorMessage);
        },
    });

    async function handleSubmit(values: EditRoadRatingFormData) {
        updateRatingMutation.mutate(values);
    }

    if (isLoadingRating) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="flex items-center justify-center gap-2">
                    <CgSpinner className="h-6 w-6 animate-spin text-primary" />
                    <p>Loading road rating data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-12">
            <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-2xl">
                <div className="text-center">
                    <div className="mb-4 flex items-center justify-center gap-2">
                        <FaRoad className="h-6 w-6 text-primary md:h-8 md:w-8" />
                        <h2 className="text-xl font-bold text-gray-900 md:text-3xl">Edit Road Rating</h2>
                    </div>
                    <p className="mt-2 mb-12 text-center text-sm text-gray-600">Update road information and manage related data</p>
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
                                            value={existingImage || undefined}
                                            onImageSelected={(base64) => {
                                                setImageBase64(base64);
                                                ratingForm.setValue('image', base64);
                                            }}
                                            onFileSelected={(file) => {
                                                setImageFile(file);
                                                ratingForm.setValue('image', file.name);
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
                                                placeholder="e.g., 4"
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

                        {/* Delete Options Section */}
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                            <h3 className="mb-4 text-sm font-semibold text-red-900">Danger Zone</h3>
                            <div className="space-y-3">
                                <FormField
                                    control={ratingForm.control}
                                    name="deleteUserRatings"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center gap-3 space-y-0">
                                            <FormControl>
                                                <input
                                                    type="checkbox"
                                                    checked={field.value || false}
                                                    onChange={field.onChange}
                                                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                                />
                                            </FormControl>
                                            <FormLabel className="mb-0 cursor-pointer text-sm font-medium text-gray-700">
                                                Delete all user ratings for this road
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={ratingForm.control}
                                    name="deleteComments"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center gap-3 space-y-0">
                                            <FormControl>
                                                <input
                                                    type="checkbox"
                                                    checked={field.value || false}
                                                    onChange={field.onChange}
                                                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                                />
                                            </FormControl>
                                            <FormLabel className="mb-0 cursor-pointer text-sm font-medium text-gray-700">
                                                Delete all comments for this road
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <p className="mt-3 text-xs text-red-600">These actions are permanent and cannot be undone.</p>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => router.visit(`/road-ratings/${id}`)}
                                className="flex w-full flex-1 cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={updateRatingMutation.isPending}
                                className="group relative flex w-full flex-1 cursor-pointer items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-gray-800 shadow-sm"
                            >
                                {updateRatingMutation.isPending ? (
                                    <div className="flex items-center justify-center">
                                        <FaStar className="mr-2 h-4 w-4 text-gray-800" />
                                        <p>Updating Rating</p>
                                        <CgSpinner className="ml-2 h-5 w-5 animate-spin text-gray-800" />
                                    </div>
                                ) : (
                                    <>
                                        <FaStar className="mr-2 h-4 w-4 text-gray-800" />
                                        Update Road Rating
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

export default function EditRoadRatingPage() {
    const page = usePage<PageProps>();
    const id = page.props.id;

    return (
        <ReactQueryProvider>
            <EditRoadRatingContent id={id} />
        </ReactQueryProvider>
    );
}

EditRoadRatingPage.layout = function (page: React.ReactNode) {
    return <RootLayout>{page}</RootLayout>;
};
