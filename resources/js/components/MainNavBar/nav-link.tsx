'use client';

import { handleMobileMenu } from './hamburger-button';

const NavLink = ({ href, label }: { href: string; label: string }) => {
    return (
        <a href={href} className="block hover:text-primary" onClick={handleMobileMenu}>
            {label}
        </a>
    );
};

export default NavLink;
