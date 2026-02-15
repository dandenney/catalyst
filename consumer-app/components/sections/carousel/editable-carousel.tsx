"use client";

import {
  type CarouselMediaSlide,
  type CarouselQuoteSlide,
  type CarouselSectionSchema,
  type CarouselSlideField,
  EditableImage,
  EditableText,
  type FieldToggleConfig,
  getDisabledFields,
  getLocalizedValue,
  isFieldEnabled,
  type LocalizedContent,
  useCatalyst,
  useVariantHandling,
} from "catalyst";
import { Pencil, Plus, Settings, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { type SectionControls } from "../../ui/section-controls";
import SectionEditBar from "../../ui/section-edit-bar";
import { Switch } from "../../ui/switch";
import { Carousel, MediaSlideLayout, QuoteSlideLayout } from "./carousel";
import { useCarousel } from "./use-carousel";

// Edit mode styling
const EDIT_CLASS =
  "cursor-pointer outline-1 outline-dashed outline-primary/50 outline-offset-2";
const EDITING_CLASS =
  "outline-2 outline-solid outline-primary outline-offset-2";

// Field toggle configuration
const CAROUSEL_FIELD_TOGGLES: FieldToggleConfig[] = [
  { key: "label", label: "Label" },
  { key: "heading", label: "Heading" },
  { key: "description", label: "Description" },
];

function createDefaultQuoteSlide(): CarouselQuoteSlide {
  return {
    type: "carouselSlide",
    slideType: "quote",
    quote: { en: "Add your testimonial quote here." },
    authorName: { en: "Author Name" },
    authorTitle: { en: "Title, Company" },
  };
}

function createDefaultMediaSlide(): CarouselMediaSlide {
  return {
    type: "carouselSlide",
    slideType: "media",
    image: {
      type: "image",
      src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop",
      alt: { en: "Slide image" },
    },
    title: { en: "Slide title" },
    description: { en: "Add a description for this slide." },
    ctaText: { en: "Learn more" },
    ctaUrl: { en: "#" },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-slide editor popover
// ─────────────────────────────────────────────────────────────────────────────

interface SlideEditorPopoverProps {
  slide: CarouselSlideField;
  index: number;
  locale: string;
  onUpdate: (slide: CarouselSlideField) => void;
  onRemove: () => void;
  canRemove: boolean;
}

function SlideEditorPopover({
  slide,
  index,
  locale,
  onUpdate,
  onRemove,
  canRemove,
}: SlideEditorPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleTypeChange = (newType: "quote" | "media") => {
    if (newType === slide.slideType) return;
    if (newType === "quote") {
      onUpdate(createDefaultQuoteSlide());
    } else {
      onUpdate(createDefaultMediaSlide());
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="absolute -right-2 -top-2 z-10 flex size-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:bg-blue-500 opacity-0 group-hover/slide:opacity-100"
          aria-label={`Edit slide ${index + 1}`}
        >
          <Pencil className="size-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72" side="right" align="start">
        <div className="space-y-4">
          <div className="text-sm font-semibold">Slide {index + 1}</div>

          {/* Slide type selector */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Slide Type</Label>
            <RadioGroup
              value={slide.slideType}
              onValueChange={(v) =>
                handleTypeChange(v as "quote" | "media")
              }
              className="flex gap-4"
            >
              <label className="flex cursor-pointer items-center gap-2">
                <RadioGroupItem value="quote" />
                <span className="text-sm">Quote</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <RadioGroupItem value="media" />
                <span className="text-sm">Media</span>
              </label>
            </RadioGroup>
          </div>

          {/* Type-specific fields */}
          {slide.slideType === "quote" && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-sm">Avatar Image URL</Label>
                <Input
                  type="text"
                  value={slide.authorAvatar?.src ?? ""}
                  onChange={(e) => {
                    const updated: CarouselQuoteSlide = {
                      ...slide,
                      authorAvatar: e.target.value
                        ? {
                            type: "image",
                            src: e.target.value,
                            alt: slide.authorAvatar?.alt ?? { en: "Author avatar" },
                          }
                        : undefined,
                    };
                    onUpdate(updated);
                  }}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>
          )}

          {slide.slideType === "media" && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-sm">
                  CTA URL ({(locale as string).toUpperCase()})
                </Label>
                <Input
                  type="text"
                  value={getLocalizedValue(slide.ctaUrl, locale as "en" | "es")}
                  onChange={(e) => {
                    const updated: CarouselMediaSlide = {
                      ...slide,
                      ctaUrl: {
                        ...slide.ctaUrl,
                        [locale]: e.target.value,
                      },
                    };
                    onUpdate(updated);
                  }}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          )}

          {/* Remove slide */}
          {canRemove && (
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={() => {
                onRemove();
                setIsOpen(false);
              }}
            >
              <Trash2 className="mr-2 size-3.5" />
              Remove slide
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

interface EditableCarouselProps {
  schema: CarouselSectionSchema;
  onUpdate?: (schema: CarouselSectionSchema) => void;
  className?: string;
  sectionControls?: SectionControls;
}

export function EditableCarousel({
  schema,
  onUpdate,
  className,
  sectionControls,
}: EditableCarouselProps) {
  const { isEditMode, locale, personalization } = useCatalyst();
  const { displaySchema, editingVariant, setEditingVariant, updateField } =
    useVariantHandling({ schema });

  const { fields } = displaySchema;
  const { settings } = schema;
  const slides = fields.slides.value as CarouselSlideField[];

  const { activeIndex, goToPrev, goToNext, goToSlide } = useCarousel({
    slideCount: slides.length,
    autoPlay: settings.autoPlay,
    autoPlayInterval: settings.autoPlayInterval,
    paused: isEditMode,
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────────────────

  const resolvedDisabledFields = getDisabledFields(schema, editingVariant);

  const handleToggleField = (fieldKey: string) => {
    if (!onUpdate) return;

    const currentDisabled = [...resolvedDisabledFields];
    const isCurrentlyDisabled = currentDisabled.includes(fieldKey);
    const updatedDisabled = isCurrentlyDisabled
      ? currentDisabled.filter((key) => key !== fieldKey)
      : [...currentDisabled, fieldKey];
    const cleanDisabled =
      updatedDisabled.length > 0 ? updatedDisabled : undefined;

    if (editingVariant) {
      const updatedVariantDisabled = {
        ...schema.variantDisabledFields,
      };
      if (cleanDisabled) {
        updatedVariantDisabled[editingVariant] = cleanDisabled;
      } else {
        delete updatedVariantDisabled[editingVariant];
      }
      onUpdate({
        ...schema,
        variantDisabledFields:
          Object.keys(updatedVariantDisabled).length > 0
            ? updatedVariantDisabled
            : undefined,
      });
    } else {
      onUpdate({ ...schema, disabledFields: cleanDisabled });
    }
  };

  const handleLabelUpdate = (content: LocalizedContent) => {
    updateField("label", content, onUpdate);
  };

  const handleHeadingUpdate = (content: LocalizedContent) => {
    updateField("heading", content, onUpdate);
  };

  const handleDescriptionUpdate = (content: LocalizedContent) => {
    updateField("description", content, onUpdate);
  };

  const handleSettingsUpdate = (key: string, value: unknown) => {
    if (!onUpdate) return;
    onUpdate({
      ...schema,
      settings: { ...schema.settings, [key]: value },
    });
  };

  const handleSlideUpdate = (index: number, slide: CarouselSlideField) => {
    const updated = [...slides];
    updated[index] = slide;
    updateField("slides", updated, onUpdate);
  };

  const handleSlideTextUpdate = (
    index: number,
    field: string,
    content: LocalizedContent,
  ) => {
    const updated = [...slides];
    updated[index] = { ...updated[index], [field]: content } as CarouselSlideField;
    updateField("slides", updated, onUpdate);
  };

  const handleSlideImageUpdate = (
    index: number,
    data: { src: string; alt: LocalizedContent },
  ) => {
    const slide = slides[index];
    if (slide.slideType === "media") {
      const updated = [...slides];
      updated[index] = {
        ...slide,
        image: { ...slide.image, src: data.src, alt: data.alt },
      };
      updateField("slides", updated, onUpdate);
    } else if (slide.slideType === "quote") {
      const updated = [...slides];
      updated[index] = {
        ...slide,
        authorAvatar: {
          type: "image",
          src: data.src,
          alt: data.alt,
        },
      };
      updateField("slides", updated, onUpdate);
    }
  };

  const handleAddSlide = (type: "quote" | "media" = "quote") => {
    const newSlide =
      type === "quote" ? createDefaultQuoteSlide() : createDefaultMediaSlide();
    updateField("slides", [...slides, newSlide], onUpdate);
  };

  const handleRemoveSlide = (index: number) => {
    const updated = slides.filter((_, i) => i !== index);
    updateField("slides", updated, onUpdate);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // View Mode
  // ─────────────────────────────────────────────────────────────────────────

  const activeVariant = isEditMode ? editingVariant : personalization.segment;

  if (!isEditMode) {
    const renderedSlides = slides.map((slide, index) => {
      if (slide.slideType === "quote") {
        return (
          <QuoteSlideLayout
            key={index}
            quote={getLocalizedValue(slide.quote, locale)}
            authorName={getLocalizedValue(slide.authorName, locale)}
            authorTitle={getLocalizedValue(slide.authorTitle, locale)}
            avatar={
              slide.authorAvatar ? (
                <img
                  src={slide.authorAvatar.src}
                  alt={getLocalizedValue(slide.authorAvatar.alt, locale)}
                  className="size-full object-cover"
                />
              ) : undefined
            }
          />
        );
      }

      return (
        <MediaSlideLayout
          key={index}
          image={
            <img
              src={slide.image.src}
              alt={getLocalizedValue(slide.image.alt, locale)}
              className="w-full object-cover"
            />
          }
          title={getLocalizedValue(slide.title, locale)}
          description={getLocalizedValue(slide.description, locale)}
          cta={
            <a
              href={getLocalizedValue(slide.ctaUrl, locale)}
              className="inline-flex items-center rounded-md border border-white/20 bg-gradient-to-b from-white to-[#C0C7D0] px-5 py-2.5 text-sm font-medium text-[#0A0E1A] transition-all duration-200 hover:from-white hover:to-white hover:shadow-[0_0_16px_rgba(255,255,255,0.15)]"
            >
              {getLocalizedValue(slide.ctaText, locale)}
            </a>
          }
        />
      );
    });

    return (
      <Carousel
        className={className}
        label={
          isFieldEnabled(schema, "label", activeVariant)
            ? getLocalizedValue(fields.label.value, locale)
            : undefined
        }
        heading={
          isFieldEnabled(schema, "heading", activeVariant)
            ? getLocalizedValue(fields.heading.value, locale)
            : undefined
        }
        description={
          isFieldEnabled(schema, "description", activeVariant)
            ? getLocalizedValue(fields.description.value, locale)
            : undefined
        }
        slides={renderedSlides}
        activeIndex={activeIndex}
        onPrev={goToPrev}
        onNext={goToNext}
        onDotClick={goToSlide}
        showDots={settings.showDots}
        showArrows={settings.showArrows}
      />
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Edit Mode
  // ─────────────────────────────────────────────────────────────────────────

  const settingsPanel = (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Settings className="size-3.5" />
        Settings
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="carousel-autoplay" className="cursor-pointer text-sm">
          Auto-play
        </Label>
        <Switch
          id="carousel-autoplay"
          checked={settings.autoPlay}
          onCheckedChange={(v) => handleSettingsUpdate("autoPlay", v)}
        />
      </div>

      {settings.autoPlay && (
        <div className="space-y-2">
          <Label className="text-sm">Interval (seconds)</Label>
          <Input
            type="number"
            min={1}
            step={1}
            value={settings.autoPlayInterval / 1000}
            onChange={(e) =>
              handleSettingsUpdate(
                "autoPlayInterval",
                Number(e.target.value) * 1000,
              )
            }
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <Label htmlFor="carousel-dots" className="cursor-pointer text-sm">
          Show dots
        </Label>
        <Switch
          id="carousel-dots"
          checked={settings.showDots}
          onCheckedChange={(v) => handleSettingsUpdate("showDots", v)}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="carousel-arrows" className="cursor-pointer text-sm">
          Show arrows
        </Label>
        <Switch
          id="carousel-arrows"
          checked={settings.showArrows}
          onCheckedChange={(v) => handleSettingsUpdate("showArrows", v)}
        />
      </div>
    </div>
  );

  const editSlides = slides.map((slide, index) => {
    if (slide.slideType === "quote") {
      return (
        <div key={index} className="group/slide relative">
          <SlideEditorPopover
            slide={slide}
            index={index}
            locale={locale}
            onUpdate={(s) => handleSlideUpdate(index, s)}
            onRemove={() => handleRemoveSlide(index)}
            canRemove={slides.length > 1}
          />
          <QuoteSlideLayout
            quote={
              <EditableText
                content={slide.quote}
                onUpdate={(content) =>
                  handleSlideTextUpdate(index, "quote", content)
                }
                editClassName={EDIT_CLASS}
                editingClassName={EDITING_CLASS}
              />
            }
            authorName={
              <EditableText
                content={slide.authorName}
                onUpdate={(content) =>
                  handleSlideTextUpdate(index, "authorName", content)
                }
                editClassName={EDIT_CLASS}
                editingClassName={EDITING_CLASS}
              />
            }
            authorTitle={
              <EditableText
                content={slide.authorTitle}
                onUpdate={(content) =>
                  handleSlideTextUpdate(index, "authorTitle", content)
                }
                editClassName={EDIT_CLASS}
                editingClassName={EDITING_CLASS}
              />
            }
            avatar={
              slide.authorAvatar ? (
                <EditableImage
                  src={slide.authorAvatar.src}
                  alt={slide.authorAvatar.alt}
                  onUpdate={(data) => handleSlideImageUpdate(index, data)}
                  className="size-full object-cover"
                />
              ) : undefined
            }
          />
        </div>
      );
    }

    return (
      <div key={index} className="group/slide relative">
        <SlideEditorPopover
          slide={slide}
          index={index}
          locale={locale}
          onUpdate={(s) => handleSlideUpdate(index, s)}
          onRemove={() => handleRemoveSlide(index)}
          canRemove={slides.length > 1}
        />
        <MediaSlideLayout
          image={
            <EditableImage
              src={slide.image.src}
              alt={slide.image.alt}
              onUpdate={(data) => handleSlideImageUpdate(index, data)}
              className="w-full object-cover"
            />
          }
          title={
            <EditableText
              content={slide.title}
              onUpdate={(content) =>
                handleSlideTextUpdate(index, "title", content)
              }
              editClassName={EDIT_CLASS}
              editingClassName={EDITING_CLASS}
            />
          }
          description={
            <EditableText
              content={slide.description}
              onUpdate={(content) =>
                handleSlideTextUpdate(index, "description", content)
              }
              editClassName={EDIT_CLASS}
              editingClassName={EDITING_CLASS}
            />
          }
          cta={
            <EditableText
              content={slide.ctaText}
              onUpdate={(content) =>
                handleSlideTextUpdate(index, "ctaText", content)
              }
              as="span"
              editClassName={EDIT_CLASS}
              editingClassName={EDITING_CLASS}
              className="inline-flex items-center rounded-md border border-white/20 bg-gradient-to-b from-white to-[#C0C7D0] px-5 py-2.5 text-sm font-medium text-[#0A0E1A]"
            />
          }
        />
      </div>
    );
  });

  return (
    <Carousel
      className={className}
      editBar={
        <SectionEditBar
          sectionType={schema.type}
          controls={sectionControls}
          variants={schema.variants}
          currentVariant={editingVariant}
          onVariantChange={setEditingVariant}
          fieldToggles={CAROUSEL_FIELD_TOGGLES}
          disabledFields={resolvedDisabledFields}
          onToggleField={handleToggleField}
          settingsPanel={settingsPanel}
        />
      }
      label={
        isFieldEnabled(schema, "label", activeVariant) ? (
          <EditableText
            content={fields.label.value}
            onUpdate={handleLabelUpdate}
            editClassName={EDIT_CLASS}
            editingClassName={EDITING_CLASS}
          />
        ) : undefined
      }
      heading={
        isFieldEnabled(schema, "heading", activeVariant) ? (
          <EditableText
            content={fields.heading.value}
            onUpdate={handleHeadingUpdate}
            editClassName={EDIT_CLASS}
            editingClassName={EDITING_CLASS}
          />
        ) : undefined
      }
      description={
        isFieldEnabled(schema, "description", activeVariant) ? (
          <EditableText
            content={fields.description.value}
            onUpdate={handleDescriptionUpdate}
            editClassName={EDIT_CLASS}
            editingClassName={EDITING_CLASS}
          />
        ) : undefined
      }
      slides={editSlides}
      activeIndex={activeIndex}
      onPrev={goToPrev}
      onNext={goToNext}
      onDotClick={goToSlide}
      showDots={settings.showDots}
      showArrows={settings.showArrows}
      addSlideButton={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleAddSlide("quote")}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#1E293B] px-4 py-3 text-[#94A3B8] transition-colors hover:border-[#3B82F6]/50 hover:text-[#3B82F6]"
          >
            <Plus className="size-4" />
            <span className="text-sm font-medium">Add quote slide</span>
          </button>
          <button
            type="button"
            onClick={() => handleAddSlide("media")}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#1E293B] px-4 py-3 text-[#94A3B8] transition-colors hover:border-[#3B82F6]/50 hover:text-[#3B82F6]"
          >
            <Plus className="size-4" />
            <span className="text-sm font-medium">Add media slide</span>
          </button>
        </div>
      }
    />
  );
}
