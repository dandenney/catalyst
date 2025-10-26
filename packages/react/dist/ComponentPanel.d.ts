/**
 * ComponentPanel
 * Side panel UI for managing components in edit mode
 */
import React from 'react';
export interface ComponentPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectComponent: (type: string) => void;
}
export declare function ComponentPanel({ isOpen, onClose, onSelectComponent }: ComponentPanelProps): React.JSX.Element | null;
