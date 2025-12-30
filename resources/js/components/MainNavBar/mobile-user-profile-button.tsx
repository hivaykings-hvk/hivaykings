'use client';

import UserAvatar from '../UserAvatar';

export const handleMobileProfileMenu = () => {
    const profileBtn = document.getElementById('profile-menu-close-btn');
    const menu = document.getElementById('mobile-profile-menu');
    const btn = document.getElementById('menu-btn');
    btn?.classList.toggle('hidden');
    profileBtn?.classList.toggle('open');
    profileBtn?.classList.toggle('hidden');
    menu?.classList.toggle('hidden');
    menu?.classList.toggle('flex');
};

interface MobileUserProfileProps {
    className?: string;
    imageUrl?: string | null | undefined;
    firstName: string;
    lastName: string;
}

const MobileUserProfileButton = (props: MobileUserProfileProps) => {
    return (
        <button id="user-profile-btn" onClick={handleMobileProfileMenu} className="focus-outline-none z-50 lg:hidden">
            <UserAvatar
                imageUrl={props.imageUrl}
                firstName={props.firstName}
                lastName={props.lastName}
                className="rounded-full border-2 border-primary"
            />
        </button>
    );
};

export default MobileUserProfileButton;
