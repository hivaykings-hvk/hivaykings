import { useEffect, useState } from 'react';
import { FiAlertTriangle, FiFileText, FiMenu, FiMessageSquare, FiNavigation, FiTrendingUp, FiX } from 'react-icons/fi';
import { ReportedQuestionCommentsForm } from './reported-question-comments';
import { ReportedQuestionsForm } from './reported-questions';
import { ReportedRoadRatingCommentsForm } from './reported-road-rating-comments';
import { ReportedTravelogueCommentsForm } from './reported-travelogue-comments';

type Section = 'overview' | 'questions' | 'road-ratings' | 'travelogues' | 'comments';

export function AdminSidebar() {
    const [activeSection, setActiveSection] = useState<Section>('overview');
    const [isMounted, setIsMounted] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const menuItems = [
        {
            id: 'overview' as Section,
            label: 'Overview',
            icon: FiTrendingUp,
        },
        {
            id: 'questions' as Section,
            label: 'Reported Questions',
            icon: FiAlertTriangle,
        },
        {
            id: 'comments' as Section,
            label: 'Reported Question Comments',
            icon: FiMessageSquare,
        },
        {
            id: 'road-ratings' as Section,
            label: 'Reported Road Rating Comments',
            icon: FiNavigation,
        },
        {
            id: 'travelogues' as Section,
            label: 'Reported Travelogue Comments',
            icon: FiFileText,
        },
    ];

    return (
        <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            {/* Desktop Sidebar */}
            <aside className="hidden w-80 flex-col border-r border-slate-200 bg-white lg:flex dark:border-slate-800 dark:bg-slate-900">
                <div className="border-b border-slate-200 p-6 dark:border-slate-800">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Admin Dashboard</h2>
                </div>

                <nav className="flex-1 space-y-1 overflow-auto p-4">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors ${
                                activeSection === item.id
                                    ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                                    : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50'
                            }`}
                        >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Mobile Header + Content */}
            <div className="flex flex-1 flex-col">
                {/* Mobile Header */}
                <div className="flex items-center gap-2 border-b border-slate-200 bg-white p-4 lg:hidden dark:border-slate-800 dark:bg-slate-900">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="flex-shrink-0 rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                        title={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                    >
                        {isMobileMenuOpen ? (
                            <FiX className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        ) : (
                            <FiMenu className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        )}
                    </button>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Admin Dashboard</h2>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="border-b border-slate-200 bg-white lg:hidden dark:border-slate-800 dark:bg-slate-900">
                        <div className="p-4">
                            <h3 className="mb-3 px-2 text-xs font-medium tracking-wide text-slate-600 uppercase dark:text-slate-400">Admin</h3>
                            <nav className="space-y-1">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setActiveSection(item.id);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                                            activeSection === item.id
                                                ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                                                : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50'
                                        }`}
                                    >
                                        <item.icon className="h-4 w-4 flex-shrink-0" />
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    <div className="p-6 sm:p-8">
                        {activeSection === 'overview' && <OverviewContent />}
                        {activeSection === 'questions' && <ReportedQuestionsForm />}
                        {activeSection === 'comments' && <ReportedQuestionCommentsForm />}
                        {activeSection === 'road-ratings' && <ReportedRoadRatingCommentsForm />}
                        {activeSection === 'travelogues' && <ReportedTravelogueCommentsForm />}
                    </div>
                </main>
            </div>
        </div>
    );
}

function OverviewContent() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/admin/dashboard-stats');

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP ${response.status}`);
            }

            const data = await response.json();
            setStats(data.data);
        } catch (error: any) {
            const errorMessage = error.message || 'Error fetching statistics';
            console.error('Error fetching stats:', errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-primary"></div>
                    <p className="mt-4 text-slate-600 dark:text-slate-400">Loading statistics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
                </div>
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                    <p className="text-red-600 dark:text-red-400">Error: {error}</p>
                    <button onClick={fetchStats} className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
                <p className="mt-1 text-slate-600 dark:text-slate-400">Summary of reported content across the platform</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="Reported Questions"
                    count={stats?.reported_questions || 0}
                    icon={FiAlertTriangle}
                    color="bg-red-50 dark:bg-red-900/20"
                    textColor="text-red-600 dark:text-red-400"
                />
                <StatCard
                    title="Reported Question Comments"
                    count={stats?.reported_question_comments || 0}
                    icon={FiMessageSquare}
                    color="bg-orange-50 dark:bg-orange-900/20"
                    textColor="text-orange-600 dark:text-orange-400"
                />
                <StatCard
                    title="Reported Road Rating Comments"
                    count={stats?.reported_road_rating_comments || 0}
                    icon={FiNavigation}
                    color="bg-yellow-50 dark:bg-yellow-900/20"
                    textColor="text-yellow-600 dark:text-yellow-400"
                />
                <StatCard
                    title="Reported Travelogues"
                    count={stats?.reported_travelogues || 0}
                    icon={FiFileText}
                    color="bg-blue-50 dark:bg-blue-900/20"
                    textColor="text-blue-600 dark:text-blue-400"
                />
                <StatCard
                    title="Reported Travelogue Comments"
                    count={stats?.reported_travelogue_comments || 0}
                    icon={FiMessageSquare}
                    color="bg-purple-50 dark:bg-purple-900/20"
                    textColor="text-purple-600 dark:text-purple-400"
                />
                <StatCard
                    title="Total Reports"
                    count={
                        (stats?.reported_questions || 0) +
                        (stats?.reported_question_comments || 0) +
                        (stats?.reported_road_rating_comments || 0) +
                        (stats?.reported_travelogues || 0) +
                        (stats?.reported_travelogue_comments || 0)
                    }
                    icon={FiTrendingUp}
                    color="bg-green-50 dark:bg-green-900/20"
                    textColor="text-green-600 dark:text-green-400"
                />
            </div>
        </div>
    );
}

interface StatCardProps {
    title: string;
    count: number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    textColor: string;
}

function StatCard({ title, count, icon: Icon, color, textColor }: StatCardProps) {
    return (
        <div className={`rounded-lg border border-slate-200 p-6 dark:border-slate-800 ${color}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
                    <p className={`mt-2 text-3xl font-bold ${textColor}`}>{count}</p>
                </div>
                <Icon className={`h-12 w-12 ${textColor} opacity-20`} />
            </div>
        </div>
    );
}

function DummyContent({ title }: { title: string }) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
                <p className="mt-1 text-slate-600 dark:text-slate-400">This page will be developed soon</p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
                <p className="text-slate-600 dark:text-slate-400">Content for {title} coming soon...</p>
            </div>
        </div>
    );
}
