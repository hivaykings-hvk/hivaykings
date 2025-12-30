'use client';

import React from 'react';

interface ActiveLinkProps {
    href: string;
    children: React.ReactNode;
}

const ActiveLink: React.FC<ActiveLinkProps> = ({ href, children }) => {
    // Using pathname from window.location for Inertia/Laravel
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const isActive = href === '/' ? pathname === href : pathname.startsWith(href);

    return (
        <a href={href} className={isActive ? 'text-primary' : 'hover:text-primary'}>
            {children}
        </a>
    );
};

export default ActiveLink;
