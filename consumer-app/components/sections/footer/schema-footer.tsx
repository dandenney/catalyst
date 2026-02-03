"use client";

import { cn } from "@/lib/utils";

import {
  EditableImage,
  EditableLink,
  EditableText,
  type FooterSectionSchema,
  type FooterColumnField,
  type LocalizedContent,
  useCatalyst,
  useVariantHandling,
} from "catalyst";

import {
  Footer,
  FooterBottom,
  FooterColumn,
  FooterContent,
} from "../../ui/footer";
import { ModeToggle } from "../../ui/mode-toggle";
import { type SectionControls } from "../../ui/section-controls";
import SectionEditBar from "../../ui/section-edit-bar";

const EDIT_CLASS =
  "cursor-pointer outline-1 outline-dashed outline-primary/50 outline-offset-2";
const EDITING_CLASS =
  "outline-2 outline-solid outline-primary outline-offset-2";

interface SchemaFooterProps {
  schema: FooterSectionSchema;
  onUpdate?: (schema: FooterSectionSchema) => void;
  className?: string;
  sectionControls?: SectionControls;
}

export default function SchemaFooter({
  schema,
  onUpdate,
  className,
  sectionControls,
}: SchemaFooterProps) {
  const { displaySchema, editingVariant, setEditingVariant, updateField } =
    useVariantHandling({ schema });

  const { fields } = displaySchema;

  const handleBrandNameUpdate = (content: LocalizedContent) => {
    updateField("brandName", content, onUpdate);
  };

  const handleBrandLogoUpdate = (data: {
    src: string;
    alt: LocalizedContent;
  }) => {
    updateField("brandLogo", data, onUpdate);
  };

  const handleCopyrightUpdate = (content: LocalizedContent) => {
    updateField("copyright", content, onUpdate);
  };

  const handleColumnUpdate = (index: number, updated: FooterColumnField) => {
    const nextColumns = [...fields.columns.value];
    nextColumns[index] = updated;
    updateField("columns", nextColumns, onUpdate);
  };

  const handleColumnTitleUpdate = (
    index: number,
    content: LocalizedContent,
  ) => {
    const nextColumns = [...fields.columns.value];
    nextColumns[index] = { ...nextColumns[index], title: content };
    updateField("columns", nextColumns, onUpdate);
  };

  const handleColumnLinkUpdate = (
    columnIndex: number,
    linkIndex: number,
    data: { href: LocalizedContent; text: LocalizedContent },
  ) => {
    const nextColumns = [...fields.columns.value];
    const column = nextColumns[columnIndex];
    const nextLinks = [...column.links];
    nextLinks[linkIndex] = data;
    nextColumns[columnIndex] = { ...column, links: nextLinks };
    updateField("columns", nextColumns, onUpdate);
  };

  const handlePolicyUpdate = (
    index: number,
    data: { href: LocalizedContent; text: LocalizedContent },
  ) => {
    const nextPolicies = [...fields.policies.value];
    nextPolicies[index] = data;
    updateField("policies", nextPolicies, onUpdate);
  };

  const hasVariants = schema.variants && Object.keys(schema.variants).length > 0;

  return (
    <footer className={cn("bg-background w-full px-4", className)}>
      <SectionEditBar
        sectionType={schema.type}
        controls={sectionControls}
        variants={hasVariants ? schema.variants : undefined}
        currentVariant={editingVariant}
        onVariantChange={setEditingVariant}
      />
      <div className="max-w-container mx-auto">
        <Footer>
          <FooterContent>
            <FooterColumn className="col-span-2 sm:col-span-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <EditableImage
                  src={fields.brandLogo.src}
                  alt={fields.brandLogo.alt}
                  onUpdate={handleBrandLogoUpdate}
                  width={24}
                  height={24}
                  className="size-6"
                />
                <EditableText
                  content={fields.brandName.value}
                  onUpdate={handleBrandNameUpdate}
                  as="h3"
                  className="text-xl font-bold"
                  editClassName={EDIT_CLASS}
                  editingClassName={EDITING_CLASS}
                />
              </div>
            </FooterColumn>
            {fields.columns.value.map((column, index) => (
              <FooterColumn key={`footer-column-${index}`}>
                <EditableText
                  content={column.title}
                  onUpdate={(content) => handleColumnTitleUpdate(index, content)}
                  as="h3"
                  className="text-md pt-1 font-semibold"
                  editClassName={EDIT_CLASS}
                  editingClassName={EDITING_CLASS}
                />
                {column.links.map((link, linkIndex) => (
                  <EditableLink
                    key={`footer-link-${index}-${linkIndex}`}
                    href={link.href}
                    text={link.text}
                    onUpdate={(data) =>
                      handleColumnLinkUpdate(index, linkIndex, data)
                    }
                    className="text-muted-foreground text-sm"
                    editClassName={EDIT_CLASS}
                    editingClassName={EDITING_CLASS}
                  />
                ))}
              </FooterColumn>
            ))}
          </FooterContent>
          <FooterBottom>
            <EditableText
              content={fields.copyright.value}
              onUpdate={handleCopyrightUpdate}
              as="p"
              editClassName={EDIT_CLASS}
              editingClassName={EDITING_CLASS}
            />
            <div className="flex items-center gap-4">
              {fields.policies.value.map((policy, index) => (
                <EditableLink
                  key={`footer-policy-${index}`}
                  href={policy.href}
                  text={policy.text}
                  onUpdate={(data) => handlePolicyUpdate(index, data)}
                  editClassName={EDIT_CLASS}
                  editingClassName={EDITING_CLASS}
                />
              ))}
              <ModeToggle />
            </div>
          </FooterBottom>
        </Footer>
      </div>
    </footer>
  );
}
