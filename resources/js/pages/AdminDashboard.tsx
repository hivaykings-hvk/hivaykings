import { ReactQueryProvider } from '@/components/HvkChowk/react-query-provider';
import RootLayout from '@/Layouts/RootLayout';
import { useEffect, useState } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { toast } from 'sonner';
import { AdminSidebar } from './Admin/components/admin-sidebar';

interface AdminUserData {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role?: string;
}

function AdminDashboardContent() {
    const [userData, setUserData] = useState<AdminUserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/user/profile');
            const data = await response.json();
            setUserData(data);
        } catch (error: any) {
            toast.error('Failed to load admin data');
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <CgSpinner className="h-24 w-24 animate-spin text-primary" />
            </div>
        );
    }

    if (!userData) {
        return <div className="flex min-h-screen items-center justify-center text-red-500">Failed to load admin dashboard</div>;
    }

    return <AdminSidebar />;
}

export default function AdminDashboardPage() {
    return (
        <ReactQueryProvider>
            <AdminDashboardContent />
        </ReactQueryProvider>
    );
}

AdminDashboardPage.layout = function (page: React.ReactNode) {
    return <RootLayout>{page}</RootLayout>;
};
