/**
 * OnlineCourses Component
 * Displays a title, description, and grid of online course cards
 */

import React from 'react';
import { OnlineCoursesSchema, LocalizedContent } from '@catalyst/core';
import { EditableText, useCatalyst, VariantSelector, useVariantHandling } from '@catalyst/react';

export interface OnlineCoursesProps {
  schema: OnlineCoursesSchema;
  onUpdate?: (schema: OnlineCoursesSchema) => void;
}

export function OnlineCourses({ schema, onUpdate }: OnlineCoursesProps) {
  const { isEditMode } = useCatalyst();

  // Use the centralized variant handling hook
  const { displaySchema, editingVariant, setEditingVariant, updateField } =
    useVariantHandling({ schema });

  const { fields } = displaySchema;

  const handleCourseFieldUpdate = (
    index: number,
    field: 'courseName' | 'instructor' | 'description' | 'duration',
    updatedContent: LocalizedContent
  ) => {
    if (!onUpdate) return;

    // Clone the current courses array
    const updatedCourses = [...fields.courses.value];
    updatedCourses[index] = {
      ...updatedCourses[index],
      [field]: updatedContent,
    };

    // Use the hook's updateField to handle variant logic
    updateField('courses', updatedCourses, onUpdate);
  };

  return (
    <div
      className="online-courses"
      style={{
        position: 'relative',
        padding: '4rem 1rem',
        maxWidth: '1200px',
        margin: '0 auto',
        border: isEditMode ? '2px dashed #cbd5e1' : 'none',
        borderRadius: isEditMode ? '8px' : '0',
      }}
    >
      {/* Component ID label in edit mode */}
      {isEditMode && (
        <div
          style={{
            position: 'absolute',
            top: '0.5rem',
            left: '1rem',
            background: '#f3f4f6',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            color: '#6b7280',
            fontFamily: 'monospace',
            zIndex: 10,
          }}
        >
          {schema.id}
        </div>
      )}

      {/* Variant Selector in edit mode */}
      {isEditMode && (
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 10,
          }}
        >
          <VariantSelector
            variants={schema.variants}
            currentVariant={editingVariant}
            onVariantChange={setEditingVariant}
          />
        </div>
      )}

      {/* Title */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        {isEditMode && editingVariant && schema.variants?.[editingVariant]?.title && (
          <div
            style={{
              position: 'absolute',
              top: '-24px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#8b5cf6',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: '500',
              whiteSpace: 'nowrap',
            }}
          >
            Variant Override
          </div>
        )}
        <EditableText
          content={fields.title.value}
          onUpdate={(content) => updateField('title', content, onUpdate)}
          as="h2"
          className="online-courses-title"
          style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '0',
          }}
        />
      </div>

      {/* Description */}
      <div style={{ position: 'relative', marginBottom: '3rem' }}>
        {isEditMode && editingVariant && schema.variants?.[editingVariant]?.description && (
          <div
            style={{
              position: 'absolute',
              top: '-24px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#8b5cf6',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: '500',
              whiteSpace: 'nowrap',
            }}
          >
            Variant Override
          </div>
        )}
        <EditableText
          content={fields.description.value}
          onUpdate={(content) => updateField('description', content, onUpdate)}
          as="p"
          className="online-courses-description"
          style={{
            fontSize: '1.25rem',
            textAlign: 'center',
            color: '#6b7280',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        />
      </div>

      {/* Course Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
        }}
      >
        {fields.courses.value.map((course, index) => (
          <div
            key={index}
            className="course-card"
            style={{
              position: 'relative',
              padding: '2rem',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              background: 'white',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!isEditMode) {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isEditMode) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }
            }}
          >
            {/* Variant Override indicator for the entire courses list */}
            {isEditMode && editingVariant && schema.variants?.[editingVariant]?.courses && index === 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '8px',
                  background: '#8b5cf6',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                }}
              >
                Variant Override (All Courses)
              </div>
            )}

            {/* Course Name */}
            <EditableText
              content={course.courseName}
              onUpdate={(updatedContent) =>
                handleCourseFieldUpdate(index, 'courseName', updatedContent)
              }
              as="h3"
              className="course-name"
              style={{
                fontSize: '1.75rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: '#1f2937',
              }}
            />

            {/* Instructor */}
            <EditableText
              content={course.instructor}
              onUpdate={(updatedContent) =>
                handleCourseFieldUpdate(index, 'instructor', updatedContent)
              }
              as="p"
              className="course-instructor"
              style={{
                fontSize: '0.875rem',
                color: '#6366f1',
                fontWeight: '500',
                marginBottom: '1rem',
              }}
            />

            {/* Description */}
            <EditableText
              content={course.description}
              onUpdate={(updatedContent) =>
                handleCourseFieldUpdate(index, 'description', updatedContent)
              }
              as="p"
              className="course-description"
              style={{
                fontSize: '1rem',
                color: '#6b7280',
                lineHeight: '1.6',
                marginBottom: '1rem',
              }}
            />

            {/* Duration */}
            <EditableText
              content={course.duration}
              onUpdate={(updatedContent) =>
                handleCourseFieldUpdate(index, 'duration', updatedContent)
              }
              as="p"
              className="course-duration"
              style={{
                fontSize: '0.875rem',
                color: '#9ca3af',
                fontWeight: '500',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
