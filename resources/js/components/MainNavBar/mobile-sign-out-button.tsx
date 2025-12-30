'use client';

import { FaPowerOff } from 'react-icons/fa6';
import { handleMobileProfileMenu } from './mobile-user-profile-button';

const MobileSignOutButton = () => {
    const handleSignOut = async () => {
        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;

            const response = await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRF-TOKEN': csrfToken || '',
                    Accept: 'application/json',
                },
            });

            if (response.ok || response.status === 204) {
                handleMobileProfileMenu();
                window.location.href = '/';
            } else {
                console.error('Logout failed with status:', response.status);
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <button onClick={handleSignOut} className="block w-full rounded-lg border border-primary px-4 py-1 hover:border-primary hover:text-primary">
            <div className="flex items-center justify-center gap-3 hover:cursor-pointer">
                <FaPowerOff className="h-5 w-5 text-gray-50 group-focus:text-neutral-800" />
                <div>Logout</div>
            </div>
        </button>
    );
};

export default MobileSignOutButton;
