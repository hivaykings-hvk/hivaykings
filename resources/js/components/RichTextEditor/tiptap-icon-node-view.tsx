'use client';

import { NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import { FaCalendarDay, FaImages, FaLocationDot, FaRoute, FaVideo } from 'react-icons/fa6';

const iconMap: Record<string, React.ComponentType<any>> = {
    FaCalendarDay,
    FaImages,
    FaVideo,
    FaLocationDot,
    FaRoute,
};

const IconNodeView = (props: any) => {
    const iconName = props.node.attrs.name;
    const IconComponent = iconMap[iconName];

    return (
        <NodeViewWrapper className="react-component inline" draggable data-drag-handle>
            {IconComponent ? <IconComponent className="inline h-5 w-5 text-primary" /> : <span>[Icon: {iconName}]</span>}
        </NodeViewWrapper>
    );
};

export default IconNodeView;
