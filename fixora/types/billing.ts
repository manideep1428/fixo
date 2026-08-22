export type PlanTier = 'free' | 'pro' | 'team' | 'enterprise';

export interface SubscriptionPlan {
  id: PlanTier;
  name: string;
  price_monthly: number;
  ai_scans_included: string; // e.g. "Unlimited (Ollama Local)"
  websites_limit: number;
  features: string[];
  popular?: boolean;
}

export interface UsageStats {
  scans_conducted: number;
  scans_limit: number | 'Unlimited';
  ai_tokens_used: number; // 0 for local Ollama
  cloud_cost_saved: number; // calculated savings vs OpenAI API
  websites_count: number;
  websites_limit: number;
}
