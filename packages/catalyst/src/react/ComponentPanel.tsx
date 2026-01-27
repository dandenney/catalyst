/**
 * ComponentPanel
 * Side panel UI for managing components in edit mode
 */

import React, { useState } from 'react';
import { ComponentMetadata, getAvailableComponents } from '../core';
import { cn } from './lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from './ui/sheet';
import { Button } from './ui/button';

export interface ComponentPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectComponent: (type: string) => void;
}

export function ComponentPanel({ isOpen, onClose, onSelectComponent }: ComponentPanelProps) {
  const [selectedComponent, setSelectedComponent] = useState<ComponentMetadata | null>(null);
  const availableComponents = getAvailableComponents();

  const handleSelectComponent = (component: ComponentMetadata) => {
    setSelectedComponent(component);
  };

  const handleAddComponent = () => {
    if (selectedComponent) {
      onSelectComponent(selectedComponent.type);
      setSelectedComponent(null);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="flex flex-col w-[400px] sm:max-w-[400px] p-0">
        <SheetHeader>
          <SheetTitle>Add Component</SheetTitle>
        </SheetHeader>

        {/* Component List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col gap-3">
            {availableComponents.map((component) => (
              <button
                key={component.type}
                onClick={() => handleSelectComponent(component)}
                className={cn(
                  'p-4 rounded-[var(--catalyst-radius-lg)] text-left transition-all',
                  selectedComponent?.type === component.type
                    ? 'border-2 border-[var(--catalyst-primary)] bg-blue-50'
                    : 'border border-[var(--catalyst-border)] bg-[var(--catalyst-background)] hover:border-[var(--catalyst-border-input)]'
                )}
              >
                <div className="flex flex-col gap-3">
                  {/* Thumbnail Preview */}
                  {component.thumbnail && (
                    <div className="w-full h-[150px] rounded-[var(--catalyst-radius-sm)] overflow-hidden bg-[var(--catalyst-muted)]">
                      <img
                        src={component.thumbnail}
                        alt={`${component.label} preview`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Component Info */}
                  <div className="flex items-start gap-3">
                    <span className="text-2xl leading-none">
                      {component.icon}
                    </span>
                    <div className="flex-1">
                      <div className="font-semibold mb-1">
                        {component.label}
                      </div>
                      <div className="text-sm text-[var(--catalyst-muted-foreground)]">
                        {component.description}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Preview & Add Button */}
        {selectedComponent && (
          <SheetFooter className="flex-col items-stretch gap-4">
            <div className="text-sm text-[var(--catalyst-muted-foreground)]">
              <strong>{selectedComponent.label}</strong> will be added to your page
            </div>
            <Button onClick={handleAddComponent} className="w-full">
              Add to Page
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
