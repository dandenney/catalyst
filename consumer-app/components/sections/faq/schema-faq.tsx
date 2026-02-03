"use client";

import { cn } from "@/lib/utils";

import {
  EditableText,
  type FAQSectionSchema,
  type FAQItemField,
  type LocalizedContent,
  useCatalyst,
  useVariantHandling,
} from "catalyst";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { Section } from "../../ui/section";
import { type SectionControls } from "../../ui/section-controls";
import SectionEditBar from "../../ui/section-edit-bar";

const EDIT_CLASS =
  "cursor-pointer outline-1 outline-dashed outline-primary/50 outline-offset-2";
const EDITING_CLASS =
  "outline-2 outline-solid outline-primary outline-offset-2";

interface SchemaFAQProps {
  schema: FAQSectionSchema;
  onUpdate?: (schema: FAQSectionSchema) => void;
  className?: string;
  sectionControls?: SectionControls;
}

interface EditableFAQProps {
  item: FAQItemField;
  index: number;
  onUpdate: (index: number, item: FAQItemField) => void;
}

function EditableFAQItem({ item, index, onUpdate }: EditableFAQProps) {
  const { isEditMode } = useCatalyst();
  const editOutlineClass = isEditMode ? EDIT_CLASS : "";

  return (
    <div className={cn(editOutlineClass, isEditMode && "cursor-pointer")}>
      <AccordionTrigger>
        <EditableText
          content={item.question}
          onUpdate={(content) =>
            onUpdate(index, { ...item, question: content })
          }
          as="span"
          className="text-left"
          editClassName={EDIT_CLASS}
          editingClassName={EDITING_CLASS}
        />
      </AccordionTrigger>
      <AccordionContent>
        <EditableText
          content={item.answer}
          onUpdate={(content) =>
            onUpdate(index, { ...item, answer: content })
          }
          as="p"
          className="text-muted-foreground mb-4 max-w-[640px] text-balance"
          editClassName={EDIT_CLASS}
          editingClassName={EDITING_CLASS}
        />
      </AccordionContent>
    </div>
  );
}

export default function SchemaFAQ({
  schema,
  onUpdate,
  className,
  sectionControls,
}: SchemaFAQProps) {
  const { isEditMode } = useCatalyst();
  const { displaySchema, editingVariant, setEditingVariant, updateField } =
    useVariantHandling({ schema });

  const { fields } = displaySchema;

  const handleTitleUpdate = (content: LocalizedContent) => {
    updateField("title", content, onUpdate);
  };

  const handleItemUpdate = (index: number, updatedItem: FAQItemField) => {
    const nextItems = [...fields.items.value];
    nextItems[index] = updatedItem;
    updateField("items", nextItems, onUpdate);
  };

  const hasVariants = schema.variants && Object.keys(schema.variants).length > 0;

  return (
    <Section className={className}>
      <SectionEditBar
        sectionType={schema.type}
        controls={sectionControls}
        variants={hasVariants ? schema.variants : undefined}
        currentVariant={editingVariant}
        onVariantChange={setEditingVariant}
      />
      <div className="max-w-container mx-auto flex flex-col items-center gap-8">
        <EditableText
          content={fields.title.value}
          onUpdate={handleTitleUpdate}
          as="h2"
          className="text-center text-3xl font-semibold sm:text-5xl"
          editClassName={EDIT_CLASS}
          editingClassName={EDITING_CLASS}
        />
        {fields.items.value.length > 0 && (
          <Accordion type="single" collapsible className="w-full max-w-[800px]">
            {fields.items.value.map((item, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <EditableFAQItem
                  item={item}
                  index={index}
                  onUpdate={handleItemUpdate}
                />
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </Section>
  );
}
