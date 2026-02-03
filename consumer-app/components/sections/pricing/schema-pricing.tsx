"use client";

import { CircleCheckBig, User, Users } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import {
  EditableText,
  getLocalizedValue,
  type LocalizedContent,
  type PricingPlanField,
  type PricingSectionSchema,
  useCatalyst,
  useEditableLink,
  useVariantHandling,
} from "catalyst";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { pricingColumnVariants } from "../../ui/pricing-column";
import { Section } from "../../ui/section";
import { type SectionControls } from "../../ui/section-controls";
import SectionEditBar from "../../ui/section-edit-bar";

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

interface EditablePricingPlanProps {
  plan: PricingPlanField;
  index: number;
  onUpdate: (index: number, plan: PricingPlanField) => void;
  hideOnMobile?: boolean;
}

function EditablePricingPlan({
  plan,
  index,
  onUpdate,
  hideOnMobile,
}: EditablePricingPlanProps) {
  const { isEditMode, locale } = useCatalyst();
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [editPrice, setEditPrice] = useState(plan.price.toString());

  // Use useEditableLink for the button
  const button = useEditableLink({
    href: plan.ctaHref,
    text: plan.ctaLabel,
    onUpdate: ({ href, text }) => {
      onUpdate(index, {
        ...plan,
        ctaLabel: text,
        ctaHref: href,
      });
    },
    editClassName: EDIT_CLASS,
    editingClassName: EDITING_CLASS,
  });

  const handlePriceSave = () => {
    onUpdate(index, {
      ...plan,
      price: parseFloat(editPrice) || 0,
    });
    setIsPriceOpen(false);
  };

  const handlePriceCancel = () => {
    setEditPrice(plan.price.toString());
    setIsPriceOpen(false);
  };

  const handlePriceKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handlePriceSave();
    } else if (e.key === "Escape") {
      handlePriceCancel();
    }
  };

  const handleNameUpdate = (content: LocalizedContent) => {
    onUpdate(index, { ...plan, name: content });
  };

  const handleDescriptionUpdate = (content: LocalizedContent) => {
    onUpdate(index, { ...plan, description: content });
  };

  const handlePriceNoteUpdate = (content: LocalizedContent) => {
    onUpdate(index, { ...plan, priceNote: content });
  };

  const handleFeatureUpdate = (featureIndex: number, content: LocalizedContent) => {
    const newFeatures = [...plan.features];
    newFeatures[featureIndex] = content;
    onUpdate(index, { ...plan, features: newFeatures });
  };

  const planIcon = index === 1 ? <User className="size-4" /> : index === 2 ? <Users className="size-4" /> : null;

  return (
    <div
      className={cn(
        pricingColumnVariants({ variant: plan.variant }),
        hideOnMobile && "hidden lg:flex"
      )}
    >
      <hr
        className={cn(
          "via-foreground/60 absolute top-0 left-[10%] h-[1px] w-[80%] border-0 bg-linear-to-r from-transparent to-transparent",
          plan.variant === "glow-brand" && "via-brand"
        )}
      />
      <div className="flex flex-col gap-7">
        <header className="flex flex-col gap-2">
          <h2 className="flex items-center gap-2 font-bold">
            {planIcon && (
              <div className="text-muted-foreground flex items-center gap-2">
                {planIcon}
              </div>
            )}
            <EditableText
              content={plan.name}
              onUpdate={handleNameUpdate}
              as="span"
              editClassName={EDIT_CLASS}
              editingClassName={EDITING_CLASS}
            />
          </h2>
          <EditableText
            content={plan.description}
            onUpdate={handleDescriptionUpdate}
            as="p"
            className="text-muted-foreground max-w-[220px] text-sm"
            editClassName={EDIT_CLASS}
            editingClassName={EDITING_CLASS}
          />
        </header>
        <section className="flex flex-col gap-3">
          <Popover open={isPriceOpen} onOpenChange={setIsPriceOpen}>
            <PopoverTrigger asChild>
              <div
                className={cn(
                  "flex items-center gap-3 lg:flex-col lg:items-start xl:flex-row xl:items-center",
                  isEditMode && EDIT_CLASS
                )}
                role={isEditMode ? "button" : undefined}
                tabIndex={isEditMode ? 0 : undefined}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-muted-foreground text-2xl font-bold">
                      $
                    </span>
                    <span className="text-6xl font-bold">{plan.price}</span>
                  </div>
                </div>
                <div className="flex min-h-[40px] flex-col">
                  {plan.price > 0 && (
                    <>
                      <span className="text-sm">one-time payment</span>
                      <span className="text-muted-foreground text-sm">
                        plus local taxes
                      </span>
                    </>
                  )}
                </div>
              </div>
            </PopoverTrigger>
            {isEditMode && (
              <PopoverContent className="w-80" onKeyDown={handlePriceKeyDown}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`price-${index}`}>Price</Label>
                    <Input
                      id={`price-${index}`}
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      placeholder="99"
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm" onClick={handlePriceCancel}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handlePriceSave}>
                      Save
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Cmd+Enter to save, Esc to cancel
                  </p>
                </div>
              </PopoverContent>
            )}
          </Popover>
        </section>
        <Popover open={button.isOpen} onOpenChange={(open) => button.setIsOpen(open)}>
          <PopoverTrigger asChild>
            <Button
              variant={plan.ctaVariant}
              size="lg"
              asChild
            >
              <a
                href={button.isEditMode ? undefined : button.displayHref}
                onClick={button.handleClick}
                className={cn(button.editModeClassName)}
                title={button.isEditMode ? "Click to edit button" : undefined}
              >
                {button.displayText}
              </a>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" onKeyDown={button.handleKeyDown}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`cta-label-${index}`}>
                  Button Text ({locale.toUpperCase()})
                </Label>
                <Input
                  id={`cta-label-${index}`}
                  type="text"
                  value={button.editText}
                  onChange={(e) => button.setEditText(e.target.value)}
                  placeholder="Get started"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`cta-href-${index}`}>
                  URL ({locale.toUpperCase()})
                </Label>
                <Input
                  id={`cta-href-${index}`}
                  type="text"
                  value={button.editHref}
                  onChange={(e) => button.setEditHref(e.target.value)}
                  placeholder="/signup"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={button.handleCancel}>
                  Cancel
                </Button>
                <Button size="sm" onClick={button.handleSave}>
                  Save
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Cmd+Enter to save, Esc to cancel
              </p>
            </div>
          </PopoverContent>
        </Popover>
        <EditableText
          content={plan.priceNote}
          onUpdate={handlePriceNoteUpdate}
          as="p"
          className="text-muted-foreground min-h-[40px] max-w-[220px] text-sm"
          editClassName={EDIT_CLASS}
          editingClassName={EDITING_CLASS}
        />
        <hr className="border-input" />
      </div>
      <div>
        <ul className="flex flex-col gap-2">
          {plan.features.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-center gap-2 text-sm">
              <CircleCheckBig className="text-muted-foreground size-4 shrink-0" />
              <EditableText
                content={feature}
                onUpdate={(content) => handleFeatureUpdate(featureIndex, content)}
                as="span"
                editClassName={EDIT_CLASS}
                editingClassName={EDITING_CLASS}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function SchemaPricing({
  schema,
  onUpdate,
  className,
  sectionControls,
}: SchemaPricingProps) {
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

  const hasVariants =
    schema.variants && Object.keys(schema.variants).length > 0;

  return (
    <Section className={cn(className)}>
      <SectionEditBar
        sectionType={schema.type}
        controls={sectionControls}
        variants={hasVariants ? schema.variants : undefined}
        currentVariant={editingVariant}
        onVariantChange={setEditingVariant}
      />
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
            {fields.plans.value.map((plan, index) => (
              <EditablePricingPlan
                key={index}
                plan={plan}
                index={index}
                onUpdate={handlePlanUpdate}
                hideOnMobile={index === 0}
              />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
