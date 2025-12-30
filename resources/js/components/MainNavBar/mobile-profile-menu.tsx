'use client';

import { FaRegUser, FaRoad, FaRoute } from 'react-icons/fa6';
import MobileSignOutButton from './mobile-sign-out-button';
import AppProfileNavLink from './profile-nav-link';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    title?: string;
    username: string;
    email: string;
    phone: string;
    image?: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    emailVerified?: string;
    phoneVerified: boolean;
    subscribeNewsletter: boolean;
}

const MobileProfileMenu = ({ user }: { user: User | null }) => {
    if (!user) return null;

    return (
        <div
            className="m-h-screen fixed inset-0 z-20 hidden h-full w-full flex-col items-center divide-y divide-primary/50 self-end bg-bgNavBarBlack px-6 py-1 pt-24 pb-4 font-medium text-white"
            id="mobile-profile-menu"
        >
            <div className="flex w-full flex-col py-3 text-center">
                <div className="font-normal">
                    {user.firstName} {user.lastName}
                </div>
                <div className="text-sm font-light text-muted">@{user.username}</div>
            </div>
            <div className="w-full py-3">
                <div className="flex items-center justify-center gap-3 hover:cursor-pointer">
                    <FaRegUser className="h-5 w-5 text-gray-50 group-focus:text-neutral-800" />
                    <AppProfileNavLink href="/account-settings" label="Account Settings" />
                </div>
            </div>
            <div className="w-full py-3">
                <div className="flex items-center justify-center gap-3 hover:cursor-pointer">
                    <FaRoute className="h-5 w-5 text-gray-50 group-focus:text-neutral-800" />
                    <AppProfileNavLink href="/travelogue/create" label="Create Travelogue" />
                </div>
            </div>
            {user.title === 'Chief' && (
                <div className="w-full py-3">
                    <div className="flex items-center justify-center gap-3 hover:cursor-pointer">
                        <FaRoad className="h-5 w-5 text-gray-50 group-focus:text-neutral-800" />
                        <AppProfileNavLink href="/road-ratings/create" label="Create Road Rating" />
                    </div>
                </div>
            )}
            <div className="absolute bottom-0 w-full p-6 text-center">
                <MobileSignOutButton />
            </div>
        </div>
    );
};

export default MobileProfileMenu;
