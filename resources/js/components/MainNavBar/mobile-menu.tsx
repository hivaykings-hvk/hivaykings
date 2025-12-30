'use client';

import AppNavLink from './nav-link';
import SignInSignUpButton from './sign-in-sign-up-button';

const MobileNavBarMenu = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
    return (
        <div
            className="m-h-screen fixed inset-0 z-20 hidden h-full w-full flex-col items-center divide-y divide-primary/50 self-end bg-bgNavBarBlack px-6 py-1 pt-24 pb-4 font-medium text-white"
            id="menu"
        >
            <div className="w-full py-3 text-center">
                <AppNavLink href="/" label="Home" />
            </div>
            <div className="w-full py-3 text-center">
                <AppNavLink href="/hvk-chowk" label="HVK Chowk" />
            </div>
            <div className="w-full py-3 text-center">
                <AppNavLink href="/hvk-store" label="HVK Store" />
            </div>
            <div className="w-full py-3 text-center">
                <AppNavLink href="/road-ratings" label="Road Ratings" />
            </div>
            <div className="w-full py-3 text-center">
                <AppNavLink href="/travelogue" label="Travelogue" />
            </div>
            <div className="w-full">
                {!isAuthenticated && (
                    <>
                        <div className="w-full py-3 text-center">
                            <SignInSignUpButton href="/auth/signin" label="SignIn" />
                        </div>
                        <div className="w-full py-3 text-center">
                            <SignInSignUpButton href="/auth/signup" label="SignUp" />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MobileNavBarMenu;
