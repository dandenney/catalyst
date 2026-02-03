"use client";

import { cn } from "@/lib/utils";

import {
  EditableText,
  type LocalizedContent,
  type PricingSectionSchema,
  type PricingPlanField,
  getLocalizedValue,
  useCatalyst,
  useEditableLink,
  useVariantHandling,
  VariantSelector,
} from "catalyst";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { PricingColumn } from "../../ui/pricing-column";
import { Section } from "../../ui/section";
import {
  type SectionControls,
  SectionDropdownItems,
} from "../../ui/section-dropdown-items";

const EDIT_CLASS =
  "cursor-pointer outline-1 outline-dashed outline-primary/50 outline-offset-2";
const EDITING_CLASS =
  "outline-2 outline-solid outline-primary outline-offset-2";

interface SchemaPricingProps {
  schema: PricingSectionSchema;
  onUpdate?: (schema: PricingSectionSchema) => void;
  className?: string;
  sectionControls?: SectionControls;
}

function EditablePlanCTA({
  plan,
  onUpdate,
}: {
  plan: PricingPlanField;
  onUpdate: (data: PricingPlanField) => void;
}) {
  const link = useEditableLink({
    href: plan.cta.href,
    text: plan.cta.text,
    onUpdate: ({ href, text }) =>
      onUpdate({
        ...plan,
        cta: { ...plan.cta, href, text },
      }),
    editClassName: EDIT_CLASS,
    editingClassName: EDITING_CLASS,
  });

  return (
    <Popover
      open={link.isOpen}
      onOpenChange={(open) => link.isEditMode && link.setIsOpen(open)}
    >
      <PopoverTrigger asChild>
        <Button
          variant={plan.cta.variant as "default" | "glow" | "glow-brand"}
          asChild
        >
          <a
            href={link.isEditMode ? undefined : link.displayHref}
            onClick={link.handleClick}
            className={cn(link.editModeClassName)}
            title={link.isEditMode ? "Click to edit CTA" : undefined}
          >
            {link.displayText}
          </a>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" onKeyDown={link.handleKeyDown}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`plan-cta-text-${plan.name.en}`}>
              Button Text ({link.locale.toUpperCase()})
            </Label>
            <Input
              id={`plan-cta-text-${plan.name.en}`}
              type="text"
              value={link.editText}
              onChange={(event) => link.setEditText(event.target.value)}
              placeholder="Get started"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`plan-cta-url-${plan.name.en}`}>
              URL ({link.locale.toUpperCase()})
            </Label>
            <Input
              id={`plan-cta-url-${plan.name.en}`}
              type="text"
              value={link.editHref}
              onChange={(event) => link.setEditHref(event.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={link.handleCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={link.handleSave}>
              Save
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Cmd+Enter to save, Esc to cancel
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function SchemaPricing({
  schema,
  onUpdate,
  className,
  sectionControls,
}: SchemaPricingProps) {
  const { isEditMode, locale } = useCatalyst();
  const { displaySchema, editingVariant, setEditingVariant, updateField } =
    useVariantHandling({ schema });

  const { fields } = displaySchema;

  const handleTitleUpdate = (content: LocalizedContent) => {
    updateField("title", content, onUpdate);
  };

  const handleDescriptionUpdate = (content: LocalizedContent) => {
    updateField("description", content, onUpdate);
  };

  const handlePlanUpdate = (index: number, updatedPlan: PricingPlanField) => {
    const nextPlans = [...fields.plans.value];
    nextPlans[index] = updatedPlan;
    updateField("plans", nextPlans, onUpdate);
  };

  const hasVariants = schema.variants && Object.keys(schema.variants).length > 0;
  const showVariantSelector = isEditMode && (hasVariants || !!sectionControls);

  return (
    <Section className={cn(className)}>
      {showVariantSelector && (
        <div className="max-w-container mx-auto flex justify-end mb-4">
          <VariantSelector
            variants={schema.variants}
            currentVariant={editingVariant}
            onVariantChange={setEditingVariant}
            extraItems={
              sectionControls ? (
                <SectionDropdownItems controls={sectionControls} />
              ) : null
            }
          />
        </div>
      )}
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-4 px-4 text-center sm:gap-8">
          <EditableText
            content={fields.title.value}
            onUpdate={handleTitleUpdate}
            as="h2"
            className="text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight"
            editClassName={EDIT_CLASS}
            editingClassName={EDITING_CLASS}
          />
          <EditableText
            content={fields.description.value}
            onUpdate={handleDescriptionUpdate}
            as="p"
            className="text-md text-muted-foreground max-w-[600px] font-medium sm:text-xl"
            editClassName={EDIT_CLASS}
            editingClassName={EDITING_CLASS}
          />
        </div>
        {fields.plans.value.length > 0 && (
          <div className="max-w-container mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {fields.plans.value.map((plan, index) => {
              const ctaContent = {
                variant: plan.cta.variant as "default" | "glow" | "glow-brand",
                label: plan.cta.text[locale] ?? plan.cta.text.en,
                href: plan.cta.href[locale] ?? plan.cta.href.en,
              };

              return (
                <PricingColumn
                  key={`${getLocalizedValue(plan.name, locale)}-${index}`}
                  name={getLocalizedValue(plan.name, locale)}
                  description={getLocalizedValue(plan.description, locale)}
                  price={Number(getLocalizedValue(plan.price, locale))}
                  priceNote={getLocalizedValue(plan.priceNote, locale)}
                  cta={ctaContent}
                  features={plan.features.map((feature) =>
                    getLocalizedValue(feature, locale),
                  )}
                  variant={plan.cta.variant as "default" | "glow" | "glow-brand"}
                  ctaRender={
                    isEditMode ? (
                      <EditablePlanCTA
                        plan={plan}
                        onUpdate={(updated) => handlePlanUpdate(index, updated)}
                      />
                    ) : undefined
                  }
                />
              );
            })}
          </div>
        )}
      </div>
    </Section>
  );
}
