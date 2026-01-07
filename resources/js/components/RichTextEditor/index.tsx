'use client';

import Blockquote from '@tiptap/extension-blockquote';
import Image from '@tiptap/extension-image';
import { Placeholder } from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect, useState } from 'react';
import { ResizableImage } from 'tiptap-extension-resizable-image';
import { convertIconsToJSX, convertJSXToIconsHTML } from './icon-html-converter';
import { IconExtension } from './tiptap-icon-extension';
import TipTapMenuBar, { MenuItem } from './tiptap-menu-bar';

export interface EditorRef {
    clearContent: () => void;
}

interface RichTextEditorProps {
    onChange?: (content: string) => void;
    content?: string;
    placeholder?: string;
    forwardedRef?: React.ForwardedRef<EditorRef>;
    menuItems?: MenuItem[];
}

const RichTextEditorComponent = ({
    onChange,
    content = '',
    placeholder = 'Share Your Experience, tips, or ask follow-up questions...',
    forwardedRef,
    menuItems,
}: RichTextEditorProps) => {
    const [showImageGallery, setShowImageGallery] = useState(false);
    const editor = useEditor({
        parseOptions: {
            preserveWhitespace: 'full',
        },
        extensions: [
            StarterKit.configure({
                link: {
                    autolink: false,
                    openOnClick: false,
                },
                paragraph: {
                    HTMLAttributes: {
                        class: 'pb-3 overflow-hidden',
                    },
                },
                bulletList: {
                    HTMLAttributes: {
                        class: 'list-disc ml-5',
                    },
                },
                listItem: {
                    HTMLAttributes: {
                        class: '[&>p]:pb-1',
                    },
                },
            }),
            Placeholder.configure({
                placeholder: placeholder,
            }),
            Image.configure({
                inline: true,
            }),
            ResizableImage.configure({
                defaultWidth: 200,
                HTMLAttributes: {
                    class: 'w-auto sm:w-full',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'center', 'right'],
                defaultAlignment: 'left',
            }),
            Blockquote.configure({
                HTMLAttributes: {
                    class: 'border-l-4 border-primary bg-yellow-50 p-4 my-4 italic',
                },
            }),
            IconExtension,
        ],
        content: convertJSXToIconsHTML(content),
        onUpdate: ({ editor }) => {
            const htmlContent = editor.getHTML();
            const jsxContent = convertIconsToJSX(htmlContent);
            onChange?.(jsxContent);
        },
        editorProps: {
            attributes: {
                class: 'min-h-[8rem] overflow-y-auto bg-white border border-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:outline-primary focus:border-primary focus:ring-primary focus:ring-[0.5px] text-gray-800 tiptap prose max-w-none',
            },
        },
        immediatelyRender: false,
    });

    useEffect(() => {
        if (editor && editor.getHTML() !== convertJSXToIconsHTML(content)) {
            editor.commands.setContent(convertJSXToIconsHTML(content));
        }
    }, [content, editor]);

    const clearContent = () => {
        if (editor) {
            editor.commands.clearContent();
        }
    };

    React.useImperativeHandle(forwardedRef, () => ({
        clearContent,
    }));

    return (
        <>
            <EditorContent editor={editor} className="w-full" />
            <TipTapMenuBar editor={editor} onImageSelection={() => setShowImageGallery(true)} menuItems={menuItems} />
        </>
    );
};

const RichTextEditor = React.forwardRef<EditorRef, RichTextEditorProps>((props, ref) => {
    return <RichTextEditorComponent {...props} forwardedRef={ref} />;
});

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
