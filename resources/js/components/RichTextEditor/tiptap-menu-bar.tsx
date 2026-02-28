'use client';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Editor } from '@tiptap/react';
import { useState } from 'react';
import { FaAlignCenter, FaAlignLeft, FaAlignRight, FaBold, FaItalic, FaList, FaRegImage } from 'react-icons/fa6';
import { TbBlockquote } from 'react-icons/tb';
import IconPicker from './icon-picker';
import LinkForm from './link-form';

export type MenuItem =
    | 'paragraph'
    | 'heading1'
    | 'heading2'
    | 'heading3'
    | 'heading4'
    | 'heading5'
    | 'heading6'
    | 'bold'
    | 'italic'
    | 'bulletList'
    | 'link'
    | 'image'
    | 'alignLeft'
    | 'alignCenter'
    | 'alignRight'
    | 'blockquote'
    | 'iconPicker';

interface TipTapMenuBarProps {
    editor: Editor | null;
    onImageSelection?: () => void;
    menuItems?: MenuItem[];
}

const TipTapMenuBar = ({ editor, onImageSelection, menuItems }: TipTapMenuBarProps) => {
    const [selectedHeading, setSelectedHeading] = useState('P');

    if (!editor) {
        return null;
    }

    const handleLinkSubmission = (link: string) => {
        if (link === null) {
            return;
        }

        if (link === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: link }).run();
    };

    const handleOnLinkFormClick = () => {
        return editor.getAttributes('link').href;
    };

    const handleUnLinkSubmission = () => {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
    };

    const handleHeadingChange = (level: 1 | 2 | 3 | 4 | 5 | 6 | 'paragraph') => {
        if (level === 'paragraph') {
            editor.chain().focus().setParagraph().run();
            setSelectedHeading('P');
        } else {
            editor.chain().focus().toggleHeading({ level }).run();
            setSelectedHeading(`H${level}`);
        }
    };

    const defaultMenuItems: MenuItem[] = [
        'paragraph',
        'heading1',
        'heading2',
        'heading3',
        'heading4',
        'heading5',
        'heading6',
        'bold',
        'italic',
        'bulletList',
        'link',
        'image',
        'alignLeft',
        'alignCenter',
        'alignRight',
        'blockquote',
        'iconPicker',
    ];

    const effectiveMenuItems = menuItems || defaultMenuItems;

    const renderMenuItem = (item: MenuItem) => {
        switch (item) {
            case 'paragraph':
            case 'heading1':
            case 'heading2':
            case 'heading3':
            case 'heading4':
            case 'heading5':
            case 'heading6':
                return (
                    <DropdownMenu key="headings">
                        <DropdownMenuTrigger className="flex items-center gap-1 text-xl leading-0 font-normal">{selectedHeading}</DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {effectiveMenuItems.includes('paragraph') && (
                                <DropdownMenuItem onClick={() => handleHeadingChange('paragraph')}>Paragraph</DropdownMenuItem>
                            )}
                            {[1, 2, 3, 4, 5, 6].map((level) => {
                                const headingKey = `heading${level}` as MenuItem;
                                return (
                                    effectiveMenuItems.includes(headingKey) && (
                                        <DropdownMenuItem key={level} onClick={() => handleHeadingChange(level as 1 | 2 | 3 | 4 | 5 | 6)}>
                                            Heading {level}
                                        </DropdownMenuItem>
                                    )
                                );
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            case 'bold':
                return (
                    <div
                        key="bold"
                        aria-label="Toggle Bold"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={editor.isActive('bold') ? 'is-active' : ''}
                    >
                        <FaBold className="h-4 w-4 cursor-pointer" />
                    </div>
                );
            case 'italic':
                return (
                    <div
                        key="italic"
                        aria-label="Toggle Italic"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={editor.isActive('italic') ? 'is-active' : ''}
                    >
                        <FaItalic className="h-4 w-4 cursor-pointer" />
                    </div>
                );
            case 'bulletList':
                return (
                    <div
                        key="bulletList"
                        aria-label="Toggle Bullet"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={editor.isActive('bulletList') ? 'is-active' : ''}
                    >
                        <FaList className="h-4 w-4 cursor-pointer" />
                    </div>
                );
            case 'link':
                return (
                    <LinkForm
                        key="link"
                        onLinkSubmit={handleLinkSubmission}
                        onUnLinkSubmit={handleUnLinkSubmission}
                        onLinkFormClick={handleOnLinkFormClick}
                    />
                );
            case 'image':
                return (
                    <div
                        key="image"
                        aria-label="Add Image"
                        onClick={() => onImageSelection && onImageSelection()}
                        className={editor.isActive('image') ? 'is-active' : ''}
                    >
                        <FaRegImage className="h-4 w-4 cursor-pointer" />
                    </div>
                );
            case 'alignLeft':
                return (
                    <div
                        key="alignLeft"
                        aria-label="Align Left"
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
                    >
                        <FaAlignLeft className="h-4 w-4 cursor-pointer" />
                    </div>
                );
            case 'alignCenter':
                return (
                    <div
                        key="alignCenter"
                        aria-label="Align Center"
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
                    >
                        <FaAlignCenter className="h-4 w-4 cursor-pointer" />
                    </div>
                );
            case 'alignRight':
                return (
                    <div
                        key="alignRight"
                        aria-label="Align Right"
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
                    >
                        <FaAlignRight className="h-4 w-4 cursor-pointer" />
                    </div>
                );
            case 'blockquote':
                return (
                    <div
                        key="blockquote"
                        aria-label="Blockquote"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={editor.isActive('blockquote') ? 'is-active' : ''}
                    >
                        <TbBlockquote className="h-5 w-5 cursor-pointer" />
                    </div>
                );
            case 'iconPicker':
                return <IconPicker key="iconPicker" editor={editor} onIconSelect={(iconName) => editor.chain().focus().setIcon(iconName).run()} />;
            default:
                return null;
        }
    };

    const headingItems = ['paragraph', 'heading1', 'heading2', 'heading3', 'heading4', 'heading5', 'heading6'];

    return (
        <div className="control-group">
            <div className="button-group flex items-center gap-5 pt-4 text-gray-500">
                {effectiveMenuItems.some((item) => headingItems.includes(item)) && renderMenuItem('paragraph')}
                {effectiveMenuItems.includes('bold') && renderMenuItem('bold')}
                {effectiveMenuItems.includes('italic') && renderMenuItem('italic')}
                {effectiveMenuItems.includes('bulletList') && renderMenuItem('bulletList')}
                {effectiveMenuItems.includes('link') && renderMenuItem('link')}
                {effectiveMenuItems.includes('image') && renderMenuItem('image')}
                {effectiveMenuItems.includes('alignLeft') && renderMenuItem('alignLeft')}
                {effectiveMenuItems.includes('alignCenter') && renderMenuItem('alignCenter')}
                {effectiveMenuItems.includes('alignRight') && renderMenuItem('alignRight')}
                {effectiveMenuItems.includes('blockquote') && renderMenuItem('blockquote')}
                {effectiveMenuItems.includes('iconPicker') && renderMenuItem('iconPicker')}
            </div>
        </div>
    );
};

export default TipTapMenuBar;
