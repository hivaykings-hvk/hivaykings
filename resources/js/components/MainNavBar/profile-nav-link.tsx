'use client';

import { handleMobileProfileMenu } from './mobile-user-profile-button';

const ProfileNavLink = ({ href, label }: { href: string; label: string }) => {
    return (
        <a href={href} className="block hover:text-primary" onClick={handleMobileProfileMenu}>
            {label}
        </a>
    );
};

export default ProfileNavLink;
