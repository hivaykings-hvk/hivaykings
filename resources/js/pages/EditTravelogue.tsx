'use client';

import { ReactQueryProvider } from '@/Components/HvkChowk/react-query-provider';
import RichTextEditor from '@/Components/RichTextEditor';
import LoadingSpinner from '@/Components/spinner';
import { Button } from '@/Components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import RootLayout from '@/Layouts/RootLayout';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, usePage } from '@inertiajs/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CgSpinner } from 'react-icons/cg';
import { FaCamera, FaTimes } from 'react-icons/fa';
import { toast } from 'sonner';
import z from 'zod';

const editTravelogueFormSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    content: z.string().min(1, 'Content is required'),
});

type EditTravelogueFormValues = z.infer<typeof editTravelogueFormSchema>;

export interface EditorRef {
    clearContent: () => void;
    setContent: (content: string) => void;
}

interface PageProps {
    id: string;
}

interface TravelogueData {
    id: string;
    title: string;
    content: string;
    coverImage: string;
    status: string;
    userId: string;
}

function EditTravelogueContent() {
    const page = usePage<PageProps>();
    const id = page.props.id;
    const editorRef = useRef<EditorRef>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const form = useForm<EditTravelogueFormValues>({
        resolver: zodResolver(editTravelogueFormSchema),
        defaultValues: {
            title: '',
            content: '',
        },
    });

    // Fetch travelogue data for editing
    const { data: travelogueData, isLoading: isLoadingTravelogue } = useQuery<{ data: TravelogueData }>({
        queryKey: ['travelogue', id, 'edit'],
        queryFn: async () => {
            const response = await axios.get(`/api/travelogues/${id}/edit`);
            return response.data;
        },
        enabled: !!id,
    });

    // Populate form when data is loaded
    useEffect(() => {
        if (travelogueData?.data) {
            const travelogue = travelogueData.data;
            form.reset({
                title: travelogue.title,
                content: travelogue.content,
            });
            if (travelogue.coverImage) {
                setCoverImagePreview(`/storage/${travelogue.coverImage}`);
            }
            editorRef.current?.setContent(travelogue.content);
        }
    }, [travelogueData, form]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setCoverImageFile(null);
        if (coverImagePreview && !coverImagePreview.startsWith('/storage/')) {
            setCoverImagePreview(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const updateTravelogueMutation = useMutation({
        mutationFn: async (data: EditTravelogueFormValues & { status: string }) => {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

            // Create FormData for multipart/form-data
            const formData = new FormData();
            formData.append('_method', 'PUT');
            formData.append('title', data.title);
            formData.append('content', data.content);
            formData.append('status', data.status);

            if (coverImageFile) {
                formData.append('cover_image', coverImageFile);
            }

            const response = await axios.post(`/api/travelogues/${id}`, formData, {
                headers: {
                    'X-CSRF-Token': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                withCredentials: true,
            });

            return response.data;
        },
        onSuccess: (data, variables) => {
            toast.success(data.message || 'Travelogue updated successfully');
            queryClient.invalidateQueries({ queryKey: ['travelogue', id] });

            // Only redirect if published, stay on page if draft
            if (variables.status === 'published') {
                router.visit(`/travelogue/${id}`);
            }
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Failed to update travelogue';
            toast.error(errorMessage);

            // Handle field-specific errors
            if (error.response?.data?.errors) {
                Object.entries(error.response.data.errors).forEach(([key, value]: any) => {
                    form.setError(key as keyof EditTravelogueFormValues, {
                        type: 'server',
                        message: value[0],
                    });
                });
            }
        },
    });

    const onSubmit = async (values: EditTravelogueFormValues, status: 'draft' | 'published') => {
        setIsSubmitting(true);
        try {
            await updateTravelogueMutation.mutateAsync({
                ...values,
                status,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingTravelogue) return <LoadingSpinner />;

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 px-6">
            <div className="container mx-auto flex flex-grow flex-col py-8">
                <h1 className="mb-6 text-3xl font-bold text-gray-800">Edit Travelogue</h1>
                <Form {...form}>
                    <form className="flex h-full flex-col space-y-6">
                        {/* Cover Image Upload */}
                        <FormItem>
                            <FormLabel>Cover Image</FormLabel>
                            <FormControl>
                                <div>
                                    {coverImagePreview ? (
                                        <div className="relative">
                                            <img src={coverImagePreview} alt="Preview" className="h-64 w-full rounded-lg object-cover" />
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="absolute top-2 right-2 rounded-full bg-primary p-2 text-gray-800"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-gray-400"
                                        >
                                            <FaCamera className="mx-auto mb-2 text-4xl text-gray-400" />
                                            <p className="text-gray-600">Click to upload or drag and drop</p>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                    )}
                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter travelogue title" {...field} className="bg-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem className="flex flex-grow flex-col">
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <div className="flex flex-grow flex-col">
                                            <RichTextEditor
                                                forwardedRef={editorRef}
                                                onChange={field.onChange}
                                                content={field.value}
                                                placeholder="Write your travelogue..."
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
                                                    'blockquote',
                                                    'image',
                                                    'iconPicker',
                                                ]}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="mt-6 flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => router.visit(`/travelogue/${id}`)}>
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={form.handleSubmit((values) => onSubmit(values, 'draft'))}
                                disabled={isSubmitting || updateTravelogueMutation.isPending}
                                className="inline-flex items-center"
                            >
                                {updateTravelogueMutation.isPending && <CgSpinner className="mr-2 animate-spin" />} Save Draft
                            </Button>
                            <Button
                                type="button"
                                onClick={form.handleSubmit((values) => onSubmit(values, 'published'))}
                                disabled={isSubmitting || updateTravelogueMutation.isPending}
                                className="inline-flex items-center bg-primary text-gray-800 hover:cursor-pointer"
                            >
                                {updateTravelogueMutation.isPending && <CgSpinner className="mr-2 animate-spin" />} Publish
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default function EditTraveloguePage() {
    return (
        <ReactQueryProvider>
            <EditTravelogueContent />
        </ReactQueryProvider>
    );
}

EditTraveloguePage.layout = function (page: React.ReactNode) {
    return <RootLayout>{page}</RootLayout>;
};
