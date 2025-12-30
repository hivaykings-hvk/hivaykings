'use client';

import { handleMobileMenu } from './hamburger-button';

const SignInSignUpButton = ({ href, label }: { href: string; label: string }) => {
    return (
        <a href={href} onClick={handleMobileMenu} className="block w-full rounded-lg bg-primary px-4 py-1 text-gray-800 hover:bg-yellow-600">
            {label}
        </a>
    );
};

export default SignInSignUpButton;
