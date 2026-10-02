export type ElementType =
  | "heading"
  | "text"
  | "button"
  | "image"
  | "video"
  | "divider"
  | "spacer"
  | "product_card"
  | "product_grid"
  | "product_carousel"
  | "category_grid"
  | "collection_showcase"
  | "countdown"
  | "reviews"
  | "trust_badges"
  | "accordion"
  | "form_embed"
  | "social_icons"
  | "html";

export interface BuilderElement {
  id: string;
  type: ElementType;
  content: {
    text?: string;
    subtext?: string;
    tag?: "h1" | "h2" | "h3" | "h4" | "p";
    url?: string;
    buttonText?: string;
    imageUrl?: string;
    videoUrl?: string;
    alt?: string;
    productId?: string;
    categorySlug?: string;
    formId?: string;
    count?: number;
    targetDate?: string;
    htmlCode?: string;
    items?: Array<{ title: string; desc: string }>;
  };
  layout: {
    width?: string;
    padding?: string;
    margin?: string;
    align?: "left" | "center" | "right";
  };
  design: {
    color?: string;
    bgColor?: string;
    fontSize?: string;
    fontWeight?: string;
    borderRadius?: string;
    shadow?: string;
    border?: string;
  };
}

export interface BuilderColumn {
  id: string;
  widthDesktop: number; // Percentage, e.g. 50, 33.3, 100
  widthTablet?: number;  // Percentage, e.g. 50, 100
  widthMobile?: number;  // Percentage, e.g. 100
  elements: BuilderElement[];
}

export interface BuilderSection {
  id: string;
  name?: string;
  layoutType: "container" | "full_width";
  bgColor?: string;
  bgImage?: string;
  paddingY?: string;
  columns: BuilderColumn[];
}

export interface BuilderPageData {
  sections: BuilderSection[];
}
