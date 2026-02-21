import axios from 'axios';
import { useEffect, useState } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { FiChevronLeft, FiChevronRight, FiEdit2 } from 'react-icons/fi';
import { toast } from 'sonner';

interface Travelogue {
    id: string;
    title: string;
    content: string;
    cover_image: string | null;
    status: 'draft' | 'published';
    created_at: string;
    updated_at: string;
    user_id: string;
}

interface PaginationData {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
}

const PER_PAGE_OPTIONS = [10, 20, 30, 50];

export function MyTraveloguesForm() {
    const [travelogues, setTravelogues] = useState<Travelogue[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchTravelogues();
    }, [perPage, currentPage]);

    const fetchTravelogues = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/user/travelogues', {
                params: {
                    per_page: perPage,
                    page: currentPage,
                },
            });

            setTravelogues(response.data.data);
            setPagination(response.data.pagination);
        } catch (error: any) {
            toast.error('Failed to load travelogues');
            console.error('Error fetching travelogues:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePerPageChange = (newPerPage: number) => {
        setPerPage(newPerPage);
        setCurrentPage(1);
    };

    const getShortDescription = (content: string) => {
        const stripped = content.replace(/<[^>]*>/g, '');
        return stripped.length > 100 ? stripped.substring(0, 100) + '...' : stripped;
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'published':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'draft':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    if (loading && travelogues.length === 0) {
        return (
            <div className="flex min-h-96 items-center justify-center">
                <CgSpinner className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Travelogues</h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Manage all your travelogues in one place</p>
            </div>

            {/* Per Page Selector */}
            <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Items per page:</label>
                <div className="flex gap-2">
                    {PER_PAGE_OPTIONS.map((option) => (
                        <button
                            key={option}
                            onClick={() => handlePerPageChange(option)}
                            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                                perPage === option
                                    ? 'bg-primary'
                                    : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                            }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
                {travelogues.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-slate-600 dark:text-slate-400">No travelogues found. Create your first travelogue!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                        Image
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {travelogues.map((travelogue) => (
                                    <tr key={travelogue.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="px-6 py-4">
                                            {travelogue.cover_image ? (
                                                <img
                                                    src={`/storage/${travelogue.cover_image}`}
                                                    alt={travelogue.title}
                                                    className="h-12 w-12 rounded object-cover"
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded bg-slate-200 dark:bg-slate-700" />
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="max-w-xs font-medium text-slate-900 dark:text-white">{travelogue.title}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="max-w-md text-sm text-slate-600 dark:text-slate-400">
                                                {getShortDescription(travelogue.content)}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeColor(travelogue.status)}`}
                                            >
                                                {travelogue.status.charAt(0).toUpperCase() + travelogue.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <a
                                                href={`/travelogue/${travelogue.id}/edit`}
                                                className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/90"
                                            >
                                                <FiEdit2 className="h-4 w-4" />
                                                Edit
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                        Showing <span className="font-semibold">{pagination.from}</span> to <span className="font-semibold">{pagination.to}</span> of{' '}
                        <span className="font-semibold">{pagination.total}</span> travelogues
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="rounded-lg border border-slate-300 bg-white p-2 text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                            <FiChevronLeft className="h-5 w-5" />
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                        page === currentPage
                                            ? 'bg-primary text-white'
                                            : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(Math.min(pagination.last_page, currentPage + 1))}
                            disabled={currentPage === pagination.last_page}
                            className="rounded-lg border border-slate-300 bg-white p-2 text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                            <FiChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
