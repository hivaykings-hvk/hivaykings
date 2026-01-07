import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeView } from '@tiptap/react';
import IconNodeView from './tiptap-icon-node-view';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        icon: {
            /**
             * Add an icon
             */
            setIcon: (iconName: string) => ReturnType;
        };
    }
}

export const IconExtension = Node.create({
    name: 'icon',
    group: 'inline',
    inline: true,
    atom: true,
    draggable: true,

    addAttributes() {
        return {
            name: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-name'),
                renderHTML: (attributes) => ({ 'data-name': attributes.name }),
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: "span[data-type='icon']",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        const iconName = HTMLAttributes['data-name'];
        if (iconName) {
            return [
                iconName.toLowerCase(),
                mergeAttributes(HTMLAttributes, {
                    'data-type': 'icon',
                    'data-name': iconName,
                    classname: 'w-6 h-6 text-primary',
                }),
            ];
        }
        return [
            'span',
            mergeAttributes(HTMLAttributes, {
                'data-type': 'icon',
            }),
        ];
    },

    addNodeView() {
        return (props: any) => {
            return new ReactNodeView(IconNodeView, props);
        };
    },

    addCommands() {
        return {
            setIcon:
                (iconName) =>
                ({ commands }: any) => {
                    return commands.insertContent({
                        type: this.name,
                        attrs: { name: iconName },
                    });
                },
        };
    },
});
