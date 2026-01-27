'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { MdClose } from 'react-icons/md';
import { toast } from 'sonner';
import GalleryImage from './gallery-image';

interface ImageGalleryProps {
    visible: boolean;
    onClose: (state: boolean) => void;
    onImageSelect?: (image: string) => void;
}

const ImageGallery = ({ visible, onClose, onImageSelect }: ImageGalleryProps) => {
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

    // Fetch user images
    const {
        data: imagesData,
        isLoading: isLoadingImages,
        isError: isImageError,
        refetch,
    } = useQuery({
        queryKey: ['userImages'],
        queryFn: async () => {
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch('/api/user-images', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(token && { 'X-CSRF-TOKEN': token }),
                },
                credentials: 'include',
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Please login to use image gallery');
                }
                throw new Error('Failed to fetch images');
            }

            return response.json();
        },
        enabled: visible,
    });

    const uploadImageMutation = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append('image', file);

            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch('/api/upload-image', {
                method: 'POST',
                credentials: 'include',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(token && { 'X-CSRF-TOKEN': token }),
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Please login to upload images');
                }
                throw new Error('Failed to upload image');
            }

            return response.json();
        },
        onSuccess: (data) => {
            toast.success('Image uploaded successfully!');
            setUploadedImages((prev) => [data.image_url, ...prev]);
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to upload image');
        },
    });

    const handleClose = () => {
        onClose(!visible);
    };

    const handleImageSelect = (image: string) => {
        if (onImageSelect) {
            onImageSelect(image);
        }
        handleClose();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast.error('Only PNG, JPG, JPEG, and WEBP are allowed');
            return;
        }

        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('File size must be less than 2MB');
            return;
        }

        uploadImageMutation.mutate(file);
        e.target.value = '';
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            const file = files[0];

            // Validate file type
            const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                toast.error('Only PNG, JPG, JPEG, and WEBP are allowed');
                return;
            }

            // Validate file size (2MB max)
            if (file.size > 2 * 1024 * 1024) {
                toast.error('File size must be less than 2MB');
                return;
            }

            uploadImageMutation.mutate(file);
        }
    };

    if (!visible) {
        return null;
    }

    const images = imagesData?.images || [];
    const allImages = [...uploadedImages, ...images];

    return (
        <div className="fixed inset-0 z-50 flex h-full min-h-screen w-full items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="relative z-50 h-4/5 overflow-y-auto rounded-xl bg-white p-4 md:w-4/5">
                <div className="absolute top-4 right-4 z-50 p-2 text-gray-500">
                    <button onClick={handleClose}>
                        <MdClose className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Upload Area */}
                <div className="flex w-full items-center justify-center">
                    <label
                        htmlFor="image-upload"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:bg-gray-100"
                    >
                        <IoCloudUploadOutline className="h-10 w-10 text-gray-500" />
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, JPEG, WEBP (MAX. 2MB)</p>
                        </div>
                        <input
                            id="image-upload"
                            type="file"
                            className="hidden"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleFileChange}
                            disabled={uploadImageMutation.isPending}
                        />
                    </label>
                </div>

                {/* Loading State */}
                {isLoadingImages && (
                    <div className="flex h-32 items-center justify-center">
                        <CgSpinner className="h-20 w-20 animate-spin text-primary" />
                    </div>
                )}

                {/* Error State */}
                {isImageError && (
                    <p className="p-4 text-center text-lg font-semibold text-red-500">
                        {isImageError ? 'Please login to upload and view images' : 'Failed to load images'}
                    </p>
                )}

                {/* Empty State */}
                {!isLoadingImages && !isImageError && allImages.length === 0 && (
                    <p className="p-4 text-center text-2xl font-semibold opacity-50">No images uploaded</p>
                )}

                {/* Image Grid */}
                {!isImageError && allImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                        {uploadImageMutation.isPending && <div className="aspect-square w-full animate-pulse rounded-lg bg-gray-200"></div>}
                        {allImages.map((image, index) => (
                            <GalleryImage key={index} src={image} onSelectClicked={() => handleImageSelect(image)} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageGallery;
