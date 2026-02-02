"use client";

import {
  EditableText,
  type LocalizedContent,
  useCatalyst,
  useEditableLink,
} from "catalyst";
import { type VariantProps } from "class-variance-authority";
import { ArrowRightIcon } from "lucide-react";
import { ReactNode, useState } from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import Github from "../../logos/github";
import { Badge } from "../../ui/badge";
import { Button, buttonVariants } from "../../ui/button";
import EditableScreenshot from "../../ui/editable-screenshot";
import Glow from "../../ui/glow";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Mockup, MockupFrame } from "../../ui/mockup";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Section } from "../../ui/section";

// Consistent edit-mode styling for all editable items
const EDIT_CLASS = "cursor-pointer outline-1 outline-dashed outline-primary/50 outline-offset-2";
const EDITING_CLASS = "outline-2 outline-solid outline-primary outline-offset-2";

interface HeroBadgeProps {
  label: LocalizedContent;
  link: {
    href: LocalizedContent;
    text: LocalizedContent;
  };
}

interface HeroButtonProps {
  href: LocalizedContent;
  text: LocalizedContent;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  icon?: ReactNode;
  iconRight?: ReactNode;
}

interface HeroMockupProps {
  srcLight: string;
  srcDark?: string;
  alt: LocalizedContent;
  width: number;
  height: number;
}

interface HeroProps {
  title?: LocalizedContent;
  description?: LocalizedContent;
  mockup?: HeroMockupProps | false;
  badge?: HeroBadgeProps | false;
  buttons?: HeroButtonProps[] | false;
  className?: string;
  onTitleUpdate?: (content: LocalizedContent) => void;
  onDescriptionUpdate?: (content: LocalizedContent) => void;
  onBadgeUpdate?: (badge: HeroBadgeProps) => void;
  onButtonsUpdate?: (buttons: HeroButtonProps[]) => void;
  onMockupUpdate?: (mockup: HeroMockupProps) => void;
}

const defaultTitle: LocalizedContent = {
  en: "Give your big idea the design it deserves",
  es: "Dale a tu gran idea el diseño que merece",
};

const defaultDescription: LocalizedContent = {
  en: "Professionally designed blocks and templates built with React, Shadcn/ui and Tailwind that will help your product stand out.",
  es: "Bloques y plantillas diseñados profesionalmente con React, Shadcn/ui y Tailwind que ayudarán a destacar tu producto.",
};

const defaultBadge: HeroBadgeProps = {
  label: {
    en: "New version of Launch UI is out!",
    es: "¡Nueva versión de Launch UI disponible!",
  },
  link: {
    href: { en: siteConfig.getStartedUrl },
    text: { en: "Get started", es: "Comenzar" },
  },
};

const defaultButtons: HeroButtonProps[] = [
  {
    href: { en: siteConfig.getStartedUrl },
    text: { en: "Get Started", es: "Comenzar" },
    variant: "default",
  },
  {
    href: { en: siteConfig.links.github },
    text: { en: "Github" },
    variant: "glow",
    icon: <Github className="mr-2 size-4" />,
  },
];

const defaultMockup: HeroMockupProps = {
  srcLight: "/dashboard-light.png",
  srcDark: "/dashboard-dark.png",
  alt: {
    en: "Launch UI app screenshot",
    es: "Captura de pantalla de Launch UI",
  },
  width: 1248,
  height: 765,
};

function EditableBadgeLink({
  href,
  text,
  onUpdate,
  children,
}: {
  href: LocalizedContent;
  text: LocalizedContent;
  onUpdate: (data: { href: LocalizedContent; text: LocalizedContent }) => void;
  children?: React.ReactNode;
}) {
  const link = useEditableLink({ href, text, onUpdate });

  const editOutlineClass = link.isEditMode
    ? link.isOpen
      ? EDITING_CLASS
      : EDIT_CLASS
    : "";

  return (
    <Popover
      open={link.isOpen}
      onOpenChange={(open) => link.isEditMode && link.setIsOpen(open)}
    >
      <PopoverTrigger asChild>
        <a
          href={link.isEditMode ? undefined : link.displayHref}
          onClick={link.handleClick}
          className={cn("flex items-center gap-1", editOutlineClass)}
          title={link.isEditMode ? "Click to edit link" : undefined}
        >
          <span>{link.displayText}</span>
          {children}
        </a>
      </PopoverTrigger>
      <PopoverContent className="w-80" onKeyDown={link.handleKeyDown}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="badge-link-text">
              Link Text ({link.locale.toUpperCase()})
            </Label>
            <Input
              id="badge-link-text"
              type="text"
              value={link.editText}
              onChange={(e) => link.setEditText(e.target.value)}
              placeholder="Click here"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="badge-link-url">
              URL ({link.locale.toUpperCase()})
            </Label>
            <Input
              id="badge-link-url"
              type="text"
              value={link.editHref}
              onChange={(e) => link.setEditHref(e.target.value)}
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

function EditableButton({
  button,
  onUpdate,
}: {
  button: HeroButtonProps;
  onUpdate: (button: HeroButtonProps) => void;
}) {
  const link = useEditableLink({
    href: button.href,
    text: button.text,
    onUpdate: ({ href, text }) => {
      onUpdate({ ...button, href, text });
    },
  });

  const editOutlineClass = link.isEditMode
    ? link.isOpen
      ? EDITING_CLASS
      : EDIT_CLASS
    : "";

  return (
    <Popover
      open={link.isOpen}
      onOpenChange={(open) => link.isEditMode && link.setIsOpen(open)}
    >
      <PopoverTrigger asChild>
        <Button
          variant={button.variant || "default"}
          size="lg"
          asChild
        >
          <a
            href={link.isEditMode ? undefined : link.displayHref}
            onClick={link.handleClick}
            className={cn(editOutlineClass)}
            title={link.isEditMode ? "Click to edit button" : undefined}
          >
            {button.icon}
            {link.displayText}
            {button.iconRight}
          </a>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" onKeyDown={link.handleKeyDown}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="btn-text">
              Button Text ({link.locale.toUpperCase()})
            </Label>
            <Input
              id="btn-text"
              type="text"
              value={link.editText}
              onChange={(e) => link.setEditText(e.target.value)}
              placeholder="Click here"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="btn-url">URL ({link.locale.toUpperCase()})</Label>
            <Input
              id="btn-url"
              type="text"
              value={link.editHref}
              onChange={(e) => link.setEditHref(e.target.value)}
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

export default function Hero({
  title: initialTitle = defaultTitle,
  description: initialDescription = defaultDescription,
  badge: initialBadge = defaultBadge,
  buttons: initialButtons = defaultButtons,
  mockup: initialMockup = defaultMockup,
  className,
  onTitleUpdate,
  onDescriptionUpdate,
  onBadgeUpdate,
  onButtonsUpdate,
  onMockupUpdate,
}: HeroProps) {
  const { isEditMode } = useCatalyst();

  // Local state for demo - in production, this would come from schema/storage
  const [title, setTitle] = useState<LocalizedContent>(initialTitle);
  const [description, setDescription] =
    useState<LocalizedContent>(initialDescription);
  const [badge, setBadge] = useState<HeroBadgeProps | false>(initialBadge);
  const [buttons, setButtons] = useState<HeroButtonProps[] | false>(
    initialButtons,
  );
  const [mockup, setMockup] = useState<HeroMockupProps | false>(initialMockup);

  const handleTitleUpdate = (content: LocalizedContent) => {
    setTitle(content);
    onTitleUpdate?.(content);
  };

  const handleDescriptionUpdate = (content: LocalizedContent) => {
    setDescription(content);
    onDescriptionUpdate?.(content);
  };

  const handleBadgeLabelUpdate = (content: LocalizedContent) => {
    if (badge === false) return;
    const updated = { ...badge, label: content };
    setBadge(updated);
    onBadgeUpdate?.(updated);
  };

  const handleBadgeLinkUpdate = ({
    href,
    text,
  }: {
    href: LocalizedContent;
    text: LocalizedContent;
  }) => {
    if (badge === false) return;
    const updated = { ...badge, link: { href, text } };
    setBadge(updated);
    onBadgeUpdate?.(updated);
  };

  const handleButtonUpdate = (index: number, updatedButton: HeroButtonProps) => {
    if (buttons === false) return;
    const newButtons = [...buttons];
    newButtons[index] = updatedButton;
    setButtons(newButtons);
    onButtonsUpdate?.(newButtons);
  };

  const handleMockupUpdate = (data: {
    srcLight: string;
    srcDark?: string;
    alt: LocalizedContent;
  }) => {
    if (mockup === false) return;
    const updated = { ...mockup, ...data };
    setMockup(updated);
    onMockupUpdate?.(updated);
  };

  return (
    <Section
      className={cn(
        "fade-bottom overflow-hidden pb-0 sm:pb-0 md:pb-0",
        className,
      )}
    >
      <div className="max-w-container mx-auto flex flex-col gap-12 pt-16 sm:gap-24">
        <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
          {badge !== false && (
            <Badge variant="outline" className="animate-appear">
              <EditableText
                content={badge.label}
                onUpdate={handleBadgeLabelUpdate}
                as="span"
                className="text-muted-foreground"
                editClassName={EDIT_CLASS}
                editingClassName={EDITING_CLASS}
              />
              <EditableBadgeLink
                href={badge.link.href}
                text={badge.link.text}
                onUpdate={handleBadgeLinkUpdate}
              >
                <ArrowRightIcon className="size-3" />
              </EditableBadgeLink>
            </Badge>
          )}
          <EditableText
            content={title}
            onUpdate={handleTitleUpdate}
            as="h1"
            className="animate-appear from-foreground to-foreground dark:to-muted-foreground relative z-10 inline-block bg-linear-to-r bg-clip-text text-4xl leading-tight font-semibold text-balance text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-8xl md:leading-tight"
            editClassName={EDIT_CLASS}
            editingClassName={EDITING_CLASS}
          />
          <EditableText
            content={description}
            onUpdate={handleDescriptionUpdate}
            as="p"
            className="text-md animate-appear text-muted-foreground relative z-10 max-w-[740px] font-medium text-balance opacity-0 delay-100 sm:text-xl"
            editClassName={EDIT_CLASS}
            editingClassName={EDITING_CLASS}
          />
          {buttons !== false && buttons.length > 0 && (
            <div className="animate-appear relative z-10 flex justify-center gap-4 opacity-0 delay-300">
              {buttons.map((button, index) => (
                <EditableButton
                  key={index}
                  button={button}
                  onUpdate={(updatedButton) =>
                    handleButtonUpdate(index, updatedButton)
                  }
                />
              ))}
            </div>
          )}
          {mockup !== false && (
            <div className="relative w-full pt-12">
              <MockupFrame
                className="animate-appear opacity-0 delay-700"
                size="small"
              >
                <Mockup
                  type="responsive"
                  className="bg-background/90 w-full rounded-xl border-0"
                >
                  <EditableScreenshot
                    srcLight={mockup.srcLight}
                    srcDark={mockup.srcDark}
                    alt={mockup.alt}
                    width={mockup.width}
                    height={mockup.height}
                    className="w-full"
                    onUpdate={handleMockupUpdate}
                    editClassName={EDIT_CLASS}
                    editingClassName={EDITING_CLASS}
                  />
                </Mockup>
              </MockupFrame>
              <Glow
                variant="top"
                className="animate-appear-zoom opacity-0 delay-1000"
              />
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
