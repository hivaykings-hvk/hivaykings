import HvkChowkTabs from '@/Components/HvkChowk/hvk-chowk-tabs';
import LeftSidebarDesktop from '@/Components/HvkChowk/LeftSidebarDesktop';
import LeftSidebarMobile from '@/Components/HvkChowk/LeftSidebarMobile';
import { ReactQueryProvider } from '@/Components/HvkChowk/react-query-provider';
import SearchBar from '@/Components/HvkChowk/SearchBar';
import RootLayout from '@/Layouts/RootLayout';
import { User } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface HvkChowkPageProps {
    user: User | null;
}

function HvkChowkPage({ user }: HvkChowkPageProps) {
    return (
        <>
            <Head title="HVK Chowk - Questions & Polls" />
            <div className="min-h-screen bg-gray-50">
                <div className="flex flex-col">
                    {/* Search Bar Section */}
                    <SearchBar />

                    {/* Mobile Trending Sheet Trigger */}
                    <LeftSidebarMobile />

                    <div className="flex">
                        {/* Left Sidebar - Desktop only */}
                        <LeftSidebarDesktop className="hidden w-1/4 lg:block" />

                        {/* Main Content */}
                        <div className="w-full bg-gray-50">
                            <div className="mx-auto px-4 py-4 lg:px-16">
                                {!user && (
                                    <div className="flex items-center justify-center lg:items-start lg:justify-start">
                                        <Link
                                            href={`/auth/signin?redirect=/hvk-chowk`}
                                            className="text-primary hover:underline hover:underline-offset-4"
                                        >
                                            Have a question for HVK? Login here
                                        </Link>
                                    </div>
                                )}

                                <ReactQueryProvider>
                                    <HvkChowkTabs user={user} />
                                </ReactQueryProvider>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

HvkChowkPage.layout = function (page: React.ReactNode) {
    return <RootLayout>{page}</RootLayout>;
};

export default HvkChowkPage;
