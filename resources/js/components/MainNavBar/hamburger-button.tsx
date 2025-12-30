'use client';

export const handleMobileMenu = () => {
    const btn = document.getElementById('menu-btn');
    const menu = document.getElementById('menu');
    btn?.classList.toggle('open');
    menu?.classList.toggle('hidden');
    menu?.classList.toggle('flex');
};

const HamburgerButton = () => {
    return (
        <button id="menu-btn" onClick={handleMobileMenu} className="focus-outline-none hamburger z-30 lg:hidden">
            <span className="hamburger-top bg-white"></span>
            <span className="hamburger-middle bg-white"></span>
            <span className="hamburger-bottom bg-white"></span>
        </button>
    );
};

export default HamburgerButton;
