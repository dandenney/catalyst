/**
 * Editable Image Component
 * Renders an image that can have its URL and alt text edited in edit mode
 */
import React from 'react';
import { LocalizedContent } from '@catalyst/core';
export interface EditableImageProps {
    src: string;
    alt: LocalizedContent;
    onUpdate?: (data: {
        src: string;
        alt: LocalizedContent;
    }) => void;
    className?: string;
    style?: React.CSSProperties;
    width?: number | string;
    height?: number | string;
}
export declare function EditableImage({ src, alt, onUpdate, className, style: customStyle, width, height, }: EditableImageProps): React.JSX.Element;
