'use client';

import { ReactQueryProvider } from '@/Components/HvkChowk/react-query-provider';
import RichTextEditor from '@/Components/RichTextEditor';
import { Button } from '@/Components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import RootLayout from '@/Layouts/RootLayout';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CgSpinner } from 'react-icons/cg';
import { FaCamera, FaTimes } from 'react-icons/fa';
import { toast } from 'sonner';
import z from 'zod';

const travelogueFormSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    content: z.string().min(1, 'Content is required'),
});

type TravelogueFormValues = z.infer<typeof travelogueFormSchema>;

export interface EditorRef {
    clearContent: () => void;
}

function CreateTravelogueContent() {
    const editorRef = useRef<EditorRef>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

    const form = useForm<TravelogueFormValues>({
        resolver: zodResolver(travelogueFormSchema),
        defaultValues: {
            title: '',
            content: '',
        },
    });

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
        setCoverImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const onSubmit = async (values: TravelogueFormValues, isPublished: boolean) => {
        if (!coverImageFile) {
            toast.error('Please upload a cover image');
            return;
        }

        setIsSubmitting(true);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

            // Create FormData for multipart/form-data
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('content', values.content);
            formData.append('cover_image', coverImageFile);
            formData.append('status', isPublished ? 'published' : 'draft');

            const response = await axios.post('/api/travelogues', formData, {
                headers: {
                    'X-CSRF-Token': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                withCredentials: true,
            });

            toast.success(response.data.message);
            form.reset();
            setCoverImageFile(null);
            setCoverImagePreview(null);
            editorRef.current?.clearContent?.();
            window.location.href = '/travelogue';
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to create travelogue';
            toast.error(errorMessage);

            // Handle field-specific errors
            if (error.response?.data?.errors) {
                Object.entries(error.response.data.errors).forEach(([key, value]: any) => {
                    form.setError(key as keyof TravelogueFormValues, {
                        type: 'server',
                        message: value[0],
                    });
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 px-6">
            <div className="container mx-auto flex flex-grow flex-col py-8">
                <h1 className="mb-6 text-3xl font-bold text-gray-800">Create New Travelogue</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit((values) => onSubmit(values, false))} className="flex h-full flex-col space-y-6">
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
                                                ]}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="mt-6 flex justify-end gap-4">
                            <Button type="submit" variant="outline" disabled={form.formState.isSubmitting || !coverImageFile}>
                                Save Draft
                            </Button>
                            <Button
                                type="button"
                                onClick={form.handleSubmit((values) => onSubmit(values, true))}
                                disabled={form.formState.isSubmitting || !coverImageFile}
                                className="inline-flex items-center bg-primary text-gray-800 hover:cursor-pointer"
                            >
                                {form.formState.isSubmitting && <CgSpinner className="mr-2 animate-spin" />} Publish
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default function CreateTraveloguePage() {
    return (
        <ReactQueryProvider>
            <CreateTravelogueContent />
        </ReactQueryProvider>
    );
}

CreateTraveloguePage.layout = function (page: React.ReactNode) {
    return <RootLayout>{page}</RootLayout>;
};
