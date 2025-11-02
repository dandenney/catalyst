/**
 * CTASection Component
 * Call-to-action section with heading, description, and button
 */
import React from 'react';
import { CTASectionSchema } from '@catalyst/core';
export interface CTASectionProps {
    schema: CTASectionSchema;
    onUpdate?: (schema: CTASectionSchema) => void;
}
export declare function CTASection({ schema, onUpdate }: CTASectionProps): React.JSX.Element;
