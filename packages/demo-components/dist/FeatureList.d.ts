/**
 * FeatureList Component
 * Displays a list of features with titles and descriptions
 */
import React from 'react';
import { FeatureListSchema } from '@catalyst/core';
export interface FeatureListProps {
    schema: FeatureListSchema;
    onUpdate?: (schema: FeatureListSchema) => void;
}
export declare function FeatureList({ schema, onUpdate }: FeatureListProps): React.JSX.Element;
