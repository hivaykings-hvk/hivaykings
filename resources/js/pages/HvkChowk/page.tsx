import HvkChowkTabs from '@/Components/HvkChowk/hvk-chowk-tabs';
import { ReactQueryProvider } from '@/Components/HvkChowk/react-query-provider';
import { User } from '@/types';
import { Head } from '@inertiajs/react';

interface HvkChowkPageProps {
    user: User | null;
}

export default function HvkChowkPage({ user }: HvkChowkPageProps) {
    return (
        <>
            <Head title="HVK Chowk - Questions & Polls" />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="mx-auto max-w-3xl px-4">
                    <div className="mb-8">
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">HVK Chowk</h1>
                        <p className="text-gray-600">Ask questions, create polls, and share your travel experiences with our community.</p>
                    </div>

                    <ReactQueryProvider>
                        <HvkChowkTabs user={user} />
                    </ReactQueryProvider>
                </div>
            </div>
        </>
    );
}
