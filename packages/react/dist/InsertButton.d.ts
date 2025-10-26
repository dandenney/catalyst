/**
 * InsertButton
 * Button that appears between components to insert new components
 */
import React from 'react';
export interface InsertButtonProps {
    onInsert: () => void;
}
export declare function InsertButton({ onInsert }: InsertButtonProps): React.JSX.Element;
