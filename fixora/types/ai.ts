export type AiModel = 'mistral' | 'llama3.1:8b';

export interface AiFix {
  id: string;
  issue_type: 'seo' | 'performance' | 'accessibility' | 'general';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  fix_code?: string;
  affected_file?: string;
  line_number?: number;
  model_used: AiModel;
  confidence: number; // 0.0 – 1.0
  applied?: boolean;
}

export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: AiModel;
  timestamp: string;
}
