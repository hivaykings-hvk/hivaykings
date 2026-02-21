import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useState } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { FiChevronLeft, FiChevronRight, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { toast } from 'sonner';

interface Question {
    id: string;
    subject: string;
    description: string;
    from_city: string;
    to_city: string;
    user_id: string;
    abuse_reported: number;
    created_at: string;
    user?: {
        id: string;
        first_name: string;
        last_name: string;
    };
}

interface PaginationData {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
}

const PER_PAGE_OPTIONS = [20, 30, 50, 100];

export function ReportedQuestionsForm() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [perPage, setPerPage] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchQuestions();
    }, [perPage, currentPage]);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/admin/reported-questions?per_page=${perPage}&page=${currentPage}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch reported questions');
            }

            const data = await response.json();
            setQuestions(data.data);
            setPagination(data.pagination);
        } catch (error: any) {
            toast.error(error.message || 'Failed to load reported questions');
            console.error('Error fetching questions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePerPageChange = (newPerPage: number) => {
        setPerPage(newPerPage);
        setCurrentPage(1);
    };

    const handleDeleteQuestion = async (questionId: string) => {
        try {
            setDeleting(true);
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const response = await fetch(`/api/admin/questions/${questionId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-Token': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete question');
            }

            toast.success('Question deleted successfully');
            setDeleteConfirm(null);
            // Refresh the questions list
            fetchQuestions();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete question');
            console.error('Error deleting question:', error);
        } finally {
            setDeleting(false);
        }
    };

    const handleDiscardQuestion = async (questionId: string) => {
        try {
            setDeleting(true);
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const response = await fetch(`/api/admin/questions/${questionId}/discard`, {
                method: 'PATCH',
                headers: {
                    'X-CSRF-Token': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to discard question');
            }

            toast.success('Question report discarded successfully');
            // Refresh the questions list
            fetchQuestions();
        } catch (error: any) {
            toast.error(error.message || 'Failed to discard question');
            console.error('Error discarding question:', error);
        } finally {
            setDeleting(false);
        }
    };

    const getShortDescription = (description: string) => {
        const stripped = description.replace(/<[^>]*>/g, '');
        return stripped.length > 100 ? stripped.substring(0, 100) + '...' : stripped;
    };

    if (loading && questions.length === 0) {
        return (
            <div className="flex min-h-96 items-center justify-center">
                <CgSpinner className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reported Questions</h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Manage all reported questions in one place</p>
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

            {questions.length === 0 ? (
                <div className="rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="p-8 text-center">
                        <p className="text-slate-600 dark:text-slate-400">No reported questions found.</p>
                    </div>
                </div>
            ) : (
                <ScrollArea className="max-w-80 rounded-lg border md:max-w-2xs lg:max-w-3xl xl:max-w-4xl">
                    <div className="flex w-max gap-4 p-4">
                        <table className="">
                            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                        Route
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                        Reports
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {questions.map((question) => (
                                    <tr key={question.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="px-6 py-4">
                                            <p className="max-w-xs font-medium text-slate-900 dark:text-white">{question.subject}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {question.from_city} → {question.to_city}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="max-w-md text-sm text-slate-600 dark:text-slate-400">
                                                {getShortDescription(question.description)}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800 dark:bg-red-900 dark:text-red-200">
                                                {question.abuse_reported}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={`/hvk-chowk/question/${question.id}`}
                                                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/90"
                                                >
                                                    <FiEdit2 className="h-4 w-4" />
                                                    View
                                                </a>
                                                <button
                                                    onClick={() => handleDiscardQuestion(question.id)}
                                                    className="inline-flex items-center gap-2 rounded-lg bg-yellow-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-yellow-700 disabled:opacity-50"
                                                    disabled={deleting}
                                                >
                                                    Discard
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(question.id)}
                                                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                                                    disabled={deleting}
                                                >
                                                    <FiTrash2 className="h-4 w-4" />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </ScrollArea>
            )}

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                        Showing <span className="font-semibold">{pagination.from}</span> to <span className="font-semibold">{pagination.to}</span> of{' '}
                        <span className="font-semibold">{pagination.total}</span> questions
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

            {/* Delete Confirmation Dialog */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="rounded-lg bg-white px-8 py-6 shadow-lg dark:bg-slate-900">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Confirm Deletion</h2>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            Are you sure you want to delete this question? This action will mark it as deleted and it will not be visible to users.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                disabled={deleting}
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteQuestion(deleteConfirm)}
                                disabled={deleting}
                                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                            >
                                {deleting && <CgSpinner className="h-4 w-4 animate-spin" />}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
