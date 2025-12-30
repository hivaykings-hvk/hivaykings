import { Link as InertiaLink } from '@inertiajs/react';
import React from 'react';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children: React.ReactNode;
    as?: string;
}

export default function Link({ href, children, as, ...props }: LinkProps) {
    return (
        <InertiaLink href={href} {...props}>
            {children}
        </InertiaLink>
    );
}
