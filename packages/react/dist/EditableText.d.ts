/**
 * Editable Text Component
 * Renders text that can be edited in-place when in edit mode
 */
import React from 'react';
import { LocalizedContent } from '@catalyst/core';
export interface EditableTextProps {
    content: LocalizedContent;
    onUpdate?: (content: LocalizedContent) => void;
    as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
    className?: string;
    style?: React.CSSProperties;
}
export declare function EditableText({ content, onUpdate, as: Component, className, style: customStyle, }: EditableTextProps): React.JSX.Element;
