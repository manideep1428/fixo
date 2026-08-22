export interface SeoMetaTag {
  name: string;
  content: string;
  status: 'good' | 'warning' | 'error';
  recommendation?: string;
}

export interface SeoKeyword {
  keyword: string;
  count: number;
  density: number; // percentage
  in_title: boolean;
  in_h1: boolean;
}

export interface SeoHeading {
  tag: 'h1' | 'h2' | 'h3' | 'h4';
  text: string;
}

export interface SeoResult {
  score: number;
  title: string;
  description: string;
  canonical_url: string;
  meta_tags: SeoMetaTag[];
  keywords: SeoKeyword[];
  headings: SeoHeading[];
  images_missing_alt: number;
  total_images: number;
  broken_links_count: number;
  sitemap_found: boolean;
  robots_txt_found: boolean;
}
