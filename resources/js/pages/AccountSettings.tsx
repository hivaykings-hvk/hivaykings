import { ReactQueryProvider } from '@/Components/HvkChowk/react-query-provider';
import RootLayout from '@/Layouts/RootLayout';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { toast } from 'sonner';
import { ProfileSidebar } from './AccountSettings/components/profile-sidebar';

interface UserData {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    username?: string;
    phone?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    image_path?: string;
    bio?: string;
    subscribe_newsletter?: boolean;
}

function AccountSettingsPageContent() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/user/profile');
            setUserData(response.data);
        } catch (error: any) {
            toast.error('Failed to load user data');
            console.error('Error fetching user data:', error);
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
        return <div className="flex min-h-screen items-center justify-center text-red-500">Failed to load account settings</div>;
    }

    return <ProfileSidebar user={userData} />;
}

export default function AccountSettingsPage() {
    return (
        <ReactQueryProvider>
            <AccountSettingsPageContent />
        </ReactQueryProvider>
    );
}

AccountSettingsPage.layout = function (page: React.ReactNode) {
    return <RootLayout>{page}</RootLayout>;
};
