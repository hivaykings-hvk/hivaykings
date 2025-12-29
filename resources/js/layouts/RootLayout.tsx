import Footer from '@/Components/footer/main-footer';
import React from 'react';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        // { <Toaster
        //   closeButton
        //   richColors
        //   position="bottom-right"
        //   duration={5000}
        // /> }
        // <NavBar />
        // <div className="mt-[72px]" />
        // <Providers>{children}</Providers>
        // <Footer />
        <div className="mt-[72px]">
            {children}
            <Footer />
        </div>
    );
}
