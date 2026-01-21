/**
 * Editable Link Component
 * Renders a link that can have its URL and text edited in edit mode
 */
import React from 'react';
import { LocalizedContent } from '@catalyst/core';
export interface EditableLinkProps {
    href: LocalizedContent;
    text: LocalizedContent;
    onUpdate?: (data: {
        href: LocalizedContent;
        text: LocalizedContent;
    }) => void;
    className?: string;
    style?: React.CSSProperties;
    target?: string;
    rel?: string;
    children?: React.ReactNode;
}
export declare function EditableLink({ href, text, onUpdate, className, style: customStyle, target, rel, children, }: EditableLinkProps): React.JSX.Element;
