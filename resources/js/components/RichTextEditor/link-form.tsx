'use client';

import { FC, useEffect, useRef, useState } from 'react';
import { FaCheck, FaLink, FaXmark } from 'react-icons/fa6';

interface Props {
    onLinkSubmit(link: string): void;
    onUnLinkSubmit(): void;
    onLinkFormClick(): string;
}

const LinkForm: FC<Props> = ({ onLinkSubmit, onUnLinkSubmit, onLinkFormClick }) => {
    const [showForm, setShowForm] = useState(false);
    const [link, setLink] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (showForm) {
            inputRef.current?.focus();
        }
    }, [showForm]);

    const onLinkFormClicked = () => {
        const link = onLinkFormClick();
        setLink(link || '');
        setShowForm(true);
    };

    return (
        <div onClick={onLinkFormClicked} className="relative">
            <FaLink className="h-5 w-5 cursor-pointer" />
            {showForm && (
                <div className="absolute top-5 -left-16 z-50 flex items-center rounded bg-white p-1 shadow-md ring-1 ring-gray-300">
                    <input
                        ref={inputRef}
                        type="text"
                        value={link}
                        onChange={({ target }) => setLink(target.value)}
                        onBlur={() => setShowForm(false)}
                        placeholder="http://example.com"
                        className="outline-none"
                    />
                    <div
                        className="mr-1 ml-3"
                        onClick={() => {
                            setLink('');
                            setShowForm(false);
                        }}
                        onMouseDown={() => {
                            onLinkSubmit(link);
                        }}
                    >
                        <FaCheck className="h-4 w-4 cursor-pointer text-primary" />
                    </div>
                    <div
                        className="mr-1 ml-3"
                        onClick={() => {
                            setLink('');
                            setShowForm(false);
                        }}
                        onMouseDown={() => {
                            onUnLinkSubmit();
                        }}
                    >
                        <FaXmark className="h-4 w-4 cursor-pointer text-primary" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default LinkForm;
