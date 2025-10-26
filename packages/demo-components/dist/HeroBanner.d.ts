/**
 * HeroBanner Component
 * Hero banner with background image, title, and subtitle
 */
import React from 'react';
import { HeroBannerSchema } from '@catalyst/core';
export interface HeroBannerProps {
    schema: HeroBannerSchema;
    onUpdate?: (schema: HeroBannerSchema) => void;
}
export declare function HeroBanner({ schema, onUpdate }: HeroBannerProps): React.JSX.Element;
