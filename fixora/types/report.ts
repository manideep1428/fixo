export interface ReportSummary {
  id: string;
  website_id: string;
  website_name: string;
  website_url: string;
  created_at: string;
  seo_score: number;
  perf_score: number;
  a11y_score: number;
  overall_score: number;
  total_issues: number;
  fixes_applied: number;
  pdf_url?: string;
  summary_text: string;
}
