'use client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import { QuestionWithUser } from '@/types/question';
import { AskHvkFormSchema } from '@/zod-schema/ask-hvk-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { CgSpinner } from 'react-icons/cg';
import { FaPaperPlane } from 'react-icons/fa';
import { toast } from 'sonner';
import z from 'zod';
import RichTextEditor from '../RichTextEditor';

interface QuestionsInfiniteQueryData {
    pages: Array<{
        questions: QuestionWithUser[];
        total: number;
        nextPage: number;
    }>;
    pageParams: number[];
}

interface User {
    id: number | string;
    name?: string;
    email?: string;
    [key: string]: any;
}

interface AskHvkFormProps {
    user?: User | null;
}

const AskHvkForm = ({ user }: AskHvkFormProps) => {
    const queryClient = useQueryClient();

    const questionForm = useForm<z.infer<typeof AskHvkFormSchema>>({
        resolver: zodResolver(AskHvkFormSchema),
        defaultValues: {
            fromCity: '',
            toCity: '',
            subject: '',
            description: '',
            hashtags: '',
        },
    });

    const createQuestionMutation = useMutation({
        mutationFn: async (newQuestion: z.infer<typeof AskHvkFormSchema>) => {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

            const response = await fetch('/api/questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'include',
                body: JSON.stringify(newQuestion),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Validation errors:', errorData);
                throw new Error(errorData.message || errorData.errors?.toString() || 'Failed to create question');
            }
            return response.json();
        },
        onSuccess: (data: QuestionWithUser) => {
            toast.success('Question posted successfully');
            queryClient.setQueryData(['questions'], (oldData: QuestionsInfiniteQueryData | undefined) => {
                if (oldData && oldData.pages) {
                    const newPages = [...oldData.pages];
                    // Add the new question to the beginning of the first page's questions array
                    newPages[0] = {
                        ...newPages[0],
                        questions: [data, ...newPages[0].questions],
                    };
                    return {
                        ...oldData,
                        pages: newPages,
                    };
                }
                return oldData;
            });
            questionForm.reset();
        },
        onError: (error) => {
            toast.error(error.message || 'Error saving question');
        },
    });

    async function handleSubmit(fromValues: z.infer<typeof AskHvkFormSchema>) {
        createQuestionMutation.mutate(fromValues);
    }

    return (
        <Form {...questionForm}>
            <form onSubmit={questionForm.handleSubmit(handleSubmit)} className="space-y-4 p-4 text-gray-700">
                <div className="flex flex-col gap-4 sm:flex-row">
                    <input id="category" name="category" defaultValue="Ask Hvk" hidden />
                    <div className="flex-1">
                        <FormField
                            control={questionForm.control}
                            name="fromCity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>From</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="City/Highway"
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex-1">
                        <FormField
                            control={questionForm.control}
                            name="toCity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>To</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Destination"
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div>
                    <FormField
                        control={questionForm.control}
                        name="subject"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Subject</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Short title of your query"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none"
                                    />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />
                </div>
                <div>
                    <FormField
                        control={questionForm.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <RichTextEditor
                                        content={field.value}
                                        onChange={field.onChange}
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
                                </FormControl>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="mt-8 flex flex-col justify-between gap-8 md:flex-row md:items-center">
                    <FormField
                        control={questionForm.control}
                        name="hashtags"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Hashtags</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Add tags (#spiti #foodstops)"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none"
                                    />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />
                    <button
                        type="submit"
                        disabled={createQuestionMutation.isPending}
                        className="inline-flex min-w-56 cursor-pointer items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-gray-800 shadow-sm"
                    >
                        {createQuestionMutation.isPending ? (
                            <div className="flex items-center justify-center">
                                <FaPaperPlane className="mr-2 h-4 w-4" />
                                <p>Posting Question</p>
                                <CgSpinner className="ml-2 h-5 w-5 animate-spin" />
                            </div>
                        ) : (
                            <>
                                <FaPaperPlane className="mr-2 h-4 w-4" />
                                Post Question
                            </>
                        )}
                    </button>
                </div>
            </form>
        </Form>
    );
};
export default AskHvkForm;
