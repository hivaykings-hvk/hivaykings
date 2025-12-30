'use client';

import { useEffect, useState } from 'react';

interface FixedNavBarWrapperProps {
    children: React.ReactNode;
}

const FixedNavBarWrapper: React.FC<FixedNavBarWrapperProps> = ({ children }) => {
    const [isFixed, setIsFixed] = useState(false);
    const [pathname, setPathname] = useState('');

    useEffect(() => {
        setPathname(window.location.pathname);

        const handleScroll = () => {
            if (window.scrollY > 74) {
                setIsFixed(true);
            } else {
                setIsFixed(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header
            className={`fixed top-0 z-50 w-full text-white ${pathname === '/' || pathname === '' ? '' : 'bg-bgNavBarBlack'} ${
                isFixed ? 'bg-bgNavBarBlack/80 transition-all duration-1000 ease-in-out' : ''
            }`}
        >
            {children}
        </header>
    );
};

export default FixedNavBarWrapper;
