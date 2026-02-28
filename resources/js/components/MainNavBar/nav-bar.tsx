'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { FaPowerOff, FaRegUser, FaRoad, FaRoute } from 'react-icons/fa6';
import { MdOutlineDashboard } from 'react-icons/md';
import UserAvatar from '../UserAvatar';
import ActiveLink from './active-link';
import FixedNavBarWrapper from './fixed-nav-bar-wrapper';
import HamburgerButton from './hamburger-button';
import MenuCloseButton from './menu-close-button';
import MobileNavBarMenu from './mobile-menu';
import MobileProfileMenu from './mobile-profile-menu';
import MobileUserProfileButton from './mobile-user-profile-button';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
    role?: string;
    emailVerified?: string;
    phoneVerified: boolean;
    subscribeNewsletter: boolean;
}

const NavBar = () => {
    const { user, isLoading, isAuthenticated } = useAuth();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted || isLoading) {
        return (
            <FixedNavBarWrapper>
                <nav className="container mx-auto flex items-center justify-between px-3 py-4">
                    <a href="/" className="z-50 flex items-center gap-2">
                        {/* <div className="rounded-lg border-2 border-white bg-primary px-3 py-1 text-gray-800">HVK</div>
                        <div className="text-primary">HiVayKings</div> */}
                        <img src="/logo.png" alt="HiVayKings Logo" className="h-8 w-auto" />
                    </a>
                    <div className="hidden items-center space-x-8 lg:flex">
                        <ActiveLink href="/">Home</ActiveLink>
                        <ActiveLink href="/hvk-chowk">HVK Chowk</ActiveLink>
                        <ActiveLink href="/hvk-store">HVK Store</ActiveLink>
                        <ActiveLink href="/road-ratings">Road Ratings</ActiveLink>
                        <ActiveLink href="/travelogue">Travelogue</ActiveLink>
                    </div>
                    <div className="hidden items-center gap-2 lg:flex">
                        <a href="/auth/signin" className="rounded-lg border border-primary px-4 py-2 hover:border-primary">
                            Login
                        </a>
                        <a href="/auth/signup" className="rounded-lg bg-primary px-4 py-2 text-gray-800">
                            Sign Up
                        </a>
                    </div>
                    <div className="inline-flex items-center gap-4 lg:hidden">
                        <HamburgerButton />
                        <MenuCloseButton />
                    </div>
                </nav>
                <MobileNavBarMenu isAuthenticated={false} />
            </FixedNavBarWrapper>
        );
    }

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
                window.location.href = '/';
            } else {
                console.error('Logout failed with status:', response.status);
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <FixedNavBarWrapper>
            <nav className="container mx-auto flex items-center justify-between px-3">
                {/* Logo Section */}
                <a href="/" className="z-50 flex items-center gap-2">
                    {/* <div className="rounded-lg border-2 border-white bg-primary px-3 py-1 text-gray-800">HVK</div>
                    <div className="text-primary">HiVayKings</div> */}
                    <img src="/logo.png" alt="HiVayKings Logo" className="h-12 w-auto md:h-14 lg:h-16" />
                </a>

                {/* Navigation Links */}
                <div className="hidden items-center space-x-8 py-4 lg:flex">
                    <ActiveLink href="/">Home</ActiveLink>
                    <ActiveLink href="/hvk-chowk">HVK Chowk</ActiveLink>
                    <ActiveLink href="/hvk-store">HVK Store</ActiveLink>
                    <ActiveLink href="/road-ratings">Road Ratings</ActiveLink>
                    <ActiveLink href="/travelogue">Travelogue</ActiveLink>
                </div>

                {/* Auth Buttons */}
                <div className="hidden items-center gap-2 py-4 lg:flex">
                    {isAuthenticated && user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <UserAvatar
                                    imageUrl={user.image}
                                    firstName={user.firstName}
                                    lastName={user.lastName}
                                    className="focus-outline-none z-50 rounded-full border-2 border-primary"
                                />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="mr-4 min-w-10 border-gray-800 bg-neutral-800 text-gray-50">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col items-start gap-2">
                                        <div className="font-normal">
                                            {user.firstName} {user.lastName}
                                        </div>
                                        <div className="text-sm font-light text-muted">@{user.username}</div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="group hover:cursor-pointer focus:bg-primary">
                                    <a href="/account-settings" className="flex items-center gap-3">
                                        <FaRegUser className="h-5 w-5 text-gray-50 group-focus:text-neutral-800" />
                                        <div className="text-sm text-gray-50 group-focus:text-neutral-800">Account Settings</div>
                                    </a>
                                </DropdownMenuItem>

                                <DropdownMenuItem className="group hover:cursor-pointer focus:bg-primary">
                                    <a href="/travelogue/create" className="flex items-center gap-3">
                                        <FaRoute className="h-5 w-5 text-gray-50 group-focus:text-neutral-800" />
                                        <div className="text-sm text-gray-50 group-focus:text-neutral-800">Create Travelogue</div>
                                    </a>
                                </DropdownMenuItem>

                                {user.title === 'Chief' && (
                                    <DropdownMenuItem className="group hover:cursor-pointer focus:bg-primary">
                                        <a href="/road-ratings/create" className="flex items-center gap-3">
                                            <FaRoad className="h-5 w-5 text-gray-50 group-focus:text-neutral-800" />
                                            <div className="text-sm text-gray-50 group-focus:text-neutral-800">Create Road Rating</div>
                                        </a>
                                    </DropdownMenuItem>
                                )}

                                {(user.role === 'admin' || user.role === 'chief') && (
                                    <DropdownMenuItem className="group hover:cursor-pointer focus:bg-primary">
                                        <a href="/admin/dashboard" className="flex items-center gap-3">
                                            <MdOutlineDashboard className="h-5 w-5 text-gray-50 group-focus:text-neutral-800" />
                                            <div className="text-sm text-gray-50 group-focus:text-neutral-800">Admin Dashboard</div>
                                        </a>
                                    </DropdownMenuItem>
                                )}

                                <DropdownMenuItem className="group focus:bg-primary">
                                    <button onClick={handleSignOut} className="flex w-full items-center gap-3 text-left">
                                        <FaPowerOff className="h-5 w-5 text-gray-50 group-focus:text-neutral-800" />
                                        <div className="text-sm text-gray-50 group-focus:text-neutral-800">Sign Out</div>
                                    </button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <a href="/auth/signin" className="rounded-lg border border-primary px-4 py-2 hover:border-primary">
                                Login
                            </a>
                            <a href="/auth/signup" className="rounded-lg bg-primary px-4 py-2 text-gray-800">
                                Sign Up
                            </a>
                        </>
                    )}
                </div>
                <div className="inline-flex items-center gap-4 py-4 lg:hidden">
                    {isAuthenticated && user && (
                        <MobileUserProfileButton imageUrl={user.image} firstName={user.firstName} lastName={user.lastName} className="z-60" />
                    )}
                    <HamburgerButton />
                    <MenuCloseButton />
                </div>
            </nav>
            <MobileNavBarMenu isAuthenticated={isAuthenticated} />
            {isAuthenticated && user && <MobileProfileMenu user={user} />}
        </FixedNavBarWrapper>
    );
};

export default NavBar;
