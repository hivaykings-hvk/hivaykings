import Footer from '@/Components/footer/main-footer';
import NavBar from '@/Components/MainNavBar/nav-bar';
import React from 'react';
import { Toaster } from 'sonner';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <NavBar />
            <div className="mt-[72px]">
                {children}
                <Footer />
            </div>
            <Toaster closeButton richColors position="bottom-right" duration={5000} />
        </>
    );
}
