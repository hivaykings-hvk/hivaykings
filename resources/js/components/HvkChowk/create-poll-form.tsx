'use client';

import { CreatePollFormSchema, CreatePollFormSchemaType } from '@/zod-schema/create-poll-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';

import { Button } from '@/Components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BarChart2, Info, Plus, Trash2 } from 'lucide-react';
import { CgSpinner } from 'react-icons/cg';
import { toast } from 'sonner';

interface PollOption {
    id: string;
    optionText: string;
    votes: number;
}

interface PollCard {
    id: string;
    questionText: string;
    userId: string;
    tags?: string;
    description?: string;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
    user: {
        firstName: string;
        lastName: string;
        title: string;
        image?: string;
    } | null;
    options: PollOption[];
    totalVotes: number;
}

interface PollsInfiniteQueryData {
    pages: Array<{
        polls: PollCard[];
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

interface CreatePollFormProps {
    user?: User | null;
}

export function CreatePollForm({ user }: CreatePollFormProps) {
    const queryClient = useQueryClient();

    const form = useForm<CreatePollFormSchemaType>({
        resolver: zodResolver(CreatePollFormSchema),
        defaultValues: {
            pollQuestion: '',
            pollOptions: [{ value: '' }, { value: '' }],
            pollDuration: '1_day',
            tags: '',
            description: '',
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'pollOptions',
    });

    const MAX_OPTIONS = 4;

    const handleAddOption = () => {
        if (fields.length < MAX_OPTIONS) {
            append({ value: '' });
        }
    };

    const handleRemoveOption = (index: number) => {
        if (fields.length > 2) {
            remove(index);
        }
    };

    const createPollMutation = useMutation({
        mutationFn: async (data: CreatePollFormSchemaType) => {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

            const response = await fetch('/api/polls', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Validation errors:', errorData);
                throw new Error(errorData.message || errorData.errors?.toString() || 'Failed to create poll');
            }
            return response.json();
        },
        onSuccess: (newPoll: PollCard) => {
            toast.success('Poll created successfully!');

            // Optimistic update: add new poll to the beginning of the first page
            queryClient.setQueryData(['polls'], (oldData: PollsInfiniteQueryData | undefined) => {
                if (oldData && oldData.pages) {
                    const newPages = [...oldData.pages];
                    // Add the new poll to the beginning of the first page's polls array
                    newPages[0] = {
                        ...newPages[0],
                        polls: [newPoll, ...newPages[0].polls],
                        total: newPages[0].total + 1,
                    };
                    return {
                        ...oldData,
                        pages: newPages,
                    };
                }
                return oldData;
            });

            form.reset();
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create poll');
        },
    });

    const onSubmit = async (data: CreatePollFormSchemaType) => {
        createPollMutation.mutate(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-6">
                <FormField
                    control={form.control}
                    name="pollQuestion"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Poll Question</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g., Which highway has the best food stops?"
                                    className="mt-2 w-full rounded-md border p-3"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="pollOptions"
                    render={() => (
                        <FormItem>
                            <FormLabel>Poll Options</FormLabel>
                            <div className="mt-2 space-y-3">
                                {fields.map((field, index) => (
                                    <FormField
                                        key={field.id}
                                        control={form.control}
                                        name={`pollOptions.${index}.value`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-gray-600">{index + 1}.</span>
                                                    <FormControl>
                                                        <Input
                                                            placeholder={`Option ${index + 1}`}
                                                            className="flex-grow rounded-md border p-3"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    {fields.length > 2 && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleRemoveOption(index)}
                                                            className="text-red-500 hover:bg-red-100"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </Button>
                                                    )}
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>
                            {fields.length < MAX_OPTIONS && (
                                <div className="mt-4">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={handleAddOption}
                                        className="flex w-auto items-center gap-1 text-primary hover:bg-yellow-50/50 hover:text-yellow-400"
                                    >
                                        <Plus className="h-4 w-4 font-bold" />
                                        <span>Add Option (max {MAX_OPTIONS})</span>
                                    </Button>
                                </div>
                            )}
                            <FormMessage /> {/* This will display array-level errors */}
                        </FormItem>
                    )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="pollDuration"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Poll Duration</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="mt-2 w-full rounded-md border p-3">
                                            <SelectValue placeholder="1 day" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="1_day">1 day</SelectItem>
                                        <SelectItem value="3_days">3 days</SelectItem>
                                        <SelectItem value="7_days">7 days</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tags</FormLabel>
                                <FormControl>
                                    <Input placeholder="#foodstops #scenic #expressway" className="mt-2 w-full rounded-md border p-3" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Add context or details about your poll..."
                                    rows={4}
                                    className="mt-2 w-full rounded-md border p-3"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex items-center justify-between text-sm text-gray-500">
                    <p className="flex items-center space-x-1">
                        <Info className="h-4 w-4" />
                        <span>Members can vote once and see live results</span>
                    </p>
                    <Button
                        type="submit"
                        disabled={createPollMutation.isPending}
                        className="flex items-center space-x-2 rounded-md bg-primary px-6 py-3 font-bold text-gray-800 hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {createPollMutation.isPending ? (
                            <>
                                <CgSpinner className="h-5 w-5 animate-spin" />
                                <span>Creating...</span>
                            </>
                        ) : (
                            <>
                                <BarChart2 className="h-5 w-5" />
                                <span>Create Poll</span>
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
export default CreatePollForm;
