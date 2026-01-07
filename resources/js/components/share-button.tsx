'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import clsx from 'clsx';
import { ReactNode, useEffect, useState } from 'react';
import { BsXCircle } from 'react-icons/bs';
import { FaCheck, FaSquareFacebook } from 'react-icons/fa6';
import { HiOutlineMail } from 'react-icons/hi';
import { IoShareSocialOutline } from 'react-icons/io5';
import { LuCopy } from 'react-icons/lu';

type IconProps = {
    title: string;
    children: ReactNode;
    className?: string;
};

type IconExternalLinkProps = IconProps & {
    href: string;
};

const createClassName = (className?: string) =>
    clsx('hover:border-b-primary-500 dark:hover:border-b-primary-400 border-b-transparent pb-0.5 hover:[&>*]:stroke-[3px]', className);

export const IconExternalLink = ({ title, href, className, children }: IconExternalLinkProps) => (
    <a title={title} target="_blank" href={href} rel="noopener noreferrer" className={createClassName(className)}>
        {children}
    </a>
);

type IconButtonProps = IconProps & {
    onClick: () => void;
};

export const IconButton = ({ title, onClick, className, children }: IconButtonProps) => (
    <button title={title} onClick={onClick} className={createClassName(className)}>
        {children}
    </button>
);

type Props = {
    title: string;
    text?: string;
    url: string;
    className?: string;
};

const isWebShareSupported = (data: ShareData) => {
    return window.navigator.canShare && window.navigator.canShare(data);
};

type ShareIconProps = {
    url: string;
    title: string;
    children?: ReactNode;
};

const ShareIcon = ({ title, url, children }: ShareIconProps) => (
    <li>
        <IconExternalLink title={title} href={url} className="hover:text-base-800 dark:hover:text-base-200 block">
            {children}
        </IconExternalLink>
    </li>
);

const CopyButton = ({ url }: { url: string }) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            const id = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(id);
        }
    }, [copied]);

    const copy = () => {
        setCopied(true);
        window.navigator.clipboard.writeText(url);
    };

    return (
        <li>
            <IconButton title="Copy url to clipboard" onClick={copy} className="hover:text-base-800 dark:hover:text-base-200">
                {copied ? <FaCheck className="h-6 w-6" /> : <LuCopy className="h-6 w-6" />}
            </IconButton>
        </li>
    );
};

const ShareButton = ({ title, text, url, className }: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    const completeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${url}?utm_campaign=social-sharing&utm_source=btn&utm_medium=`;

    const onClick = async () => {
        const data: ShareData = {
            title,
            text,
            url: completeUrl + 'native',
        };
        if (isWebShareSupported(data)) {
            await window.navigator.share(data);
        } else {
            setIsOpen(true);
        }
    };

    return (
        <>
            <button onClick={onClick} className={clsx('group flex items-center gap-1 hover:cursor-pointer', className)}>
                <IoShareSocialOutline className="h-5 w-5" />
                <span>share</span>
            </button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Share post</DialogTitle>
                        <DialogDescription className="mt-2">{title}</DialogDescription>
                    </DialogHeader>

                    <ul className="text-base-500 dark:text-base-400 mt-6 flex justify-around gap-2">
                        <ShareIcon
                            title="Share on Facebook"
                            url={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(completeUrl + 'facebook')}`}
                        >
                            <FaSquareFacebook className="h-6 w-6" />
                        </ShareIcon>
                        <ShareIcon
                            title="Send by e-mail"
                            url={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
                                text + '\n\n',
                            )}${encodeURIComponent(completeUrl + 'email')}`}
                        >
                            <HiOutlineMail className="h-7 w-7" />
                        </ShareIcon>
                        <CopyButton url={completeUrl + 'copy'} />
                    </ul>
                    <button className="group absolute top-4 right-4" aria-label="Close" onClick={() => setIsOpen(false)}>
                        <BsXCircle className="text-base-normal h-7 w-7" />
                    </button>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ShareButton;
