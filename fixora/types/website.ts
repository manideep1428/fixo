export type WebsiteStatus = 'active' | 'inactive' | 'scanning' | 'error';

export interface Website {
  id: string;
  url: string;
  name: string;
  status: WebsiteStatus;
  owner: string;
  created_at: string;
  last_scanned?: string;
  seo_score?: number;
  perf_score?: number;
  a11y_score?: number;
  overall_score?: number;
  total_issues?: number;
  favicon?: string;
  tech_stack?: string[];
}

export interface WebsiteCreatePayload {
  url: string;
  name: string;
}
