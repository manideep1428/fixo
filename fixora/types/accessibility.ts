export type WcagLevel = 'A' | 'AA' | 'AAA';
export type A11yImpact = 'critical' | 'serious' | 'moderate' | 'minor';

export interface A11yIssue {
  id: string;
  code: string;
  wcag_level: WcagLevel;
  impact: A11yImpact;
  help: string;
  description: string;
  selector: string;
  html_snippet: string;
  suggested_fix: string;
}

export interface AccessibilityResult {
  score: number;
  total_issues: number;
  by_impact: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
  issues: A11yIssue[];
  passed_checks_count: number;
}
