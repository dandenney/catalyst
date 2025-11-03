/**
 * OnlineCourses Component
 * Displays a title, description, and grid of online course cards
 */
import React from 'react';
import { OnlineCoursesSchema } from '@catalyst/core';
export interface OnlineCoursesProps {
    schema: OnlineCoursesSchema;
    onUpdate?: (schema: OnlineCoursesSchema) => void;
}
export declare function OnlineCourses({ schema, onUpdate }: OnlineCoursesProps): React.JSX.Element;
