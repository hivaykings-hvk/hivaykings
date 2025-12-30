'use client';

export const handleClick = () => {
    const profileMenu = document.getElementById('mobile-profile-menu');
    profileMenu?.classList.toggle('hidden');
    profileMenu?.classList.toggle('flex');
    const profileBtn = document.getElementById('profile-menu-close-btn');
    profileBtn?.classList.toggle('open');
    profileBtn?.classList.toggle('hidden');
    const menuBtn = document.getElementById('menu-btn');
    menuBtn?.classList.toggle('hidden');
    menuBtn?.classList.toggle('flex');
};

const MenuCloseButton = () => {
    return (
        <button id="profile-menu-close-btn" onClick={handleClick} className="focus-outline-none hamburger z-40 hidden">
            <span className="hamburger-top bg-white"></span>
            <span className="hamburger-middle bg-white"></span>
            <span className="hamburger-bottom bg-white"></span>
        </button>
    );
};

export default MenuCloseButton;
