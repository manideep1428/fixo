import type { SeoResult } from './seo';
import type { PerformanceResult } from './performance';
import type { AccessibilityResult } from './accessibility';
import type { AiFix } from './ai';

export type ScanStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface Screenshot {
  id: string;
  url: string;
  device: 'desktop' | 'mobile';
  captured_at: string;
  type: 'before' | 'after';
}

export interface ScanResults {
  seo: SeoResult;
  performance: PerformanceResult;
  accessibility: AccessibilityResult;
  ai_fixes: AiFix[];
  screenshots: Screenshot[];
}

export interface ScanJob {
  id: string;
  website_id: string;
  website_name: string;
  url: string;
  status: ScanStatus;
  progress: number; // 0-100
  current_step?: string;
  started_at?: string;
  finished_at?: string;
  error?: string;
  results?: ScanResults;
}
