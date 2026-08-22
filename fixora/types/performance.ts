export interface CoreWebVital {
  metric: 'LCP' | 'FID' | 'CLS' | 'FCP' | 'TTFB' | 'INP';
  name: string;
  value: number;
  unit: 'ms' | 's' | 'score';
  status: 'good' | 'needs-improvement' | 'poor';
  benchmark: string;
}

export interface PerformanceOpportunity {
  title: string;
  description: string;
  savings_ms?: number;
  savings_bytes?: number;
  score: number;
}

export interface PerformanceResult {
  score: number;
  core_web_vitals: CoreWebVital[];
  lighthouse_metrics: {
    first_contentful_paint: number;
    speed_index: number;
    largest_contentful_paint: number;
    time_to_interactive: number;
    total_blocking_time: number;
    cumulative_layout_shift: number;
  };
  opportunities: PerformanceOpportunity[];
  unminified_css_kb: number;
  unminified_js_kb: number;
  total_page_size_mb: number;
}
