'use client';

import { useEffect, useRef } from 'react';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    menuItems?: string[];
    placeholder?: string;
}

export default function RichTextEditor({ content, onChange, menuItems, placeholder = 'Write your reply here...' }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (editorRef.current && content && editorRef.current.innerHTML !== content) {
            editorRef.current.innerHTML = content;
        }
    }, [content]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const applyCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        // Trigger onChange after command is applied
        setTimeout(() => {
            if (editorRef.current) {
                onChange(editorRef.current.innerHTML);
            }
        }, 0);
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    };

    return (
        <div className="overflow-hidden rounded-lg border border-gray-300">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 border-b border-gray-300 bg-gray-100 p-2">
                {menuItems?.includes('paragraph') && (
                    <button
                        type="button"
                        onClick={() => applyCommand('formatBlock', 'p')}
                        className="rounded border border-gray-300 bg-white px-2 py-1 text-xs hover:bg-gray-50"
                    >
                        P
                    </button>
                )}
                {menuItems?.includes('heading1') && (
                    <button
                        type="button"
                        onClick={() => applyCommand('formatBlock', 'h1')}
                        className="rounded border border-gray-300 bg-white px-2 py-1 text-xs hover:bg-gray-50"
                    >
                        H1
                    </button>
                )}
                {menuItems?.includes('heading2') && (
                    <button
                        type="button"
                        onClick={() => applyCommand('formatBlock', 'h2')}
                        className="rounded border border-gray-300 bg-white px-2 py-1 text-xs hover:bg-gray-50"
                    >
                        H2
                    </button>
                )}
                {menuItems?.includes('heading3') && (
                    <button
                        type="button"
                        onClick={() => applyCommand('formatBlock', 'h3')}
                        className="rounded border border-gray-300 bg-white px-2 py-1 text-xs hover:bg-gray-50"
                    >
                        H3
                    </button>
                )}
                {menuItems?.includes('bold') && (
                    <button
                        type="button"
                        onClick={() => applyCommand('bold')}
                        className="rounded border border-gray-300 bg-white px-2 py-1 text-xs font-bold hover:bg-gray-50"
                    >
                        B
                    </button>
                )}
                {menuItems?.includes('italic') && (
                    <button
                        type="button"
                        onClick={() => applyCommand('italic')}
                        className="rounded border border-gray-300 bg-white px-2 py-1 text-xs italic hover:bg-gray-50"
                    >
                        I
                    </button>
                )}
                {menuItems?.includes('bulletList') && (
                    <button
                        type="button"
                        onClick={() => applyCommand('insertUnorderedList')}
                        className="rounded border border-gray-300 bg-white px-2 py-1 text-xs hover:bg-gray-50"
                    >
                        • List
                    </button>
                )}
                {menuItems?.includes('link') && (
                    <button
                        type="button"
                        onClick={() => {
                            const url = prompt('Enter URL:');
                            if (url) applyCommand('createLink', url);
                        }}
                        className="rounded border border-gray-300 bg-white px-2 py-1 text-xs hover:bg-gray-50"
                    >
                        Link
                    </button>
                )}
                {menuItems?.includes('blockquote') && (
                    <button
                        type="button"
                        onClick={() => applyCommand('formatBlock', 'blockquote')}
                        className="rounded border border-gray-300 bg-white px-2 py-1 text-xs hover:bg-gray-50"
                    >
                        Quote
                    </button>
                )}
            </div>

            {/* Editor */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onPaste={handlePaste}
                suppressContentEditableWarning
                className="min-h-[200px] w-full p-4 text-gray-700 focus:outline-none"
                data-placeholder={placeholder}
            />
        </div>
    );
}
