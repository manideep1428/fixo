/**
 * Fixora backend API service — typed wrappers for every endpoint.
 * Shapes mirror types/* exactly (Django returns the same field names).
 */

import { apiFetch, tokenStorage } from './apiClient';
import type { Website, WebsiteCreatePayload } from '../types/website';
import type { ScanJob } from '../types/scanner';
import type { ReportSummary } from '../types/report';
import type { SubscriptionPlan, UsageStats } from '../types/billing';
import type { AiFix } from '../types/ai';

export interface AuthResponse {
  access: string;
  refresh: string;
}

export const authApi = {
  register: (payload: { username: string; email: string; password: string; phone_number?: string }) =>
    apiFetch<{ message: string }>('/api/auth/register/', {
      method: 'POST',
      body: payload,
      skipAuth: true,
    }),

  async login(username: string, password: string) {
    const data = await apiFetch<AuthResponse>('/api/auth/login/', {
      method: 'POST',
      body: { username, password },
      skipAuth: true,
    });
    tokenStorage.set(data.access, data.refresh);
    return data;
  },

  logout: () => tokenStorage.clear(),

  me: () => apiFetch<Record<string, unknown>>('/api/auth/me/'),
};

export const websitesApi = {
  list: () => apiFetch<Website[]>('/api/websites/'),

  get: (id: string) => apiFetch<Website>(`/api/websites/${id}/`),

  create: (payload: WebsiteCreatePayload) =>
    apiFetch<Website>('/api/websites/', { method: 'POST', body: payload }),

  update: (id: string, updates: Partial<Website>) =>
    apiFetch<Website>(`/api/websites/${id}/`, { method: 'PATCH', body: updates }),

  remove: (id: string) => apiFetch<void>(`/api/websites/${id}/`, { method: 'DELETE' }),
};

export const scansApi = {
  list: () => apiFetch<ScanJob[]>('/api/scans/'),

  get: (id: string) => apiFetch<ScanJob>(`/api/scans/${id}/`),

  start: (websiteId: string) =>
    apiFetch<ScanJob>('/api/scans/start/', {
      method: 'POST',
      body: { website_id: websiteId },
    }),
};

export interface AnalysisLatest {
  seo?: Record<string, unknown>;
  performance?: Record<string, unknown>;
  accessibility?: Record<string, unknown>;
}

export const analysisApi = {
  latest: (websiteId: string) =>
    apiFetch<AnalysisLatest>(`/api/analysis/results/latest/?website=${encodeURIComponent(websiteId)}`),
};

export const reportsApi = {
  list: () => apiFetch<ReportSummary[]>('/api/reports/'),

  get: (id: string) => apiFetch<ReportSummary>(`/api/reports/${id}/`),
};

export const billingApi = {
  plans: () => apiFetch<SubscriptionPlan[]>('/api/billing/plans/'),

  usage: () => apiFetch<UsageStats>('/api/billing/usage/'),

  subscription: () => apiFetch<{ plan: SubscriptionPlan | null }>('/api/billing/subscription/'),

  selectPlan: (tier: string) =>
    apiFetch<{ plan: SubscriptionPlan }>('/api/billing/subscription/', {
      method: 'POST',
      body: { tier },
    }),
};

export const aiApi = {
  fixes: (scanId?: string) =>
    apiFetch<AiFix[]>(`/api/ai/fixes/${scanId ? `?scan=${scanId}` : ''}`),

  applyFix: (fixId: string) =>
    apiFetch<AiFix>(`/api/ai/fixes/${fixId}/apply/`, { method: 'POST' }),

  chatHistory: () => apiFetch<unknown[]>('/api/ai/chat/'),

  chat: (content: string, model?: string, scanId?: string) =>
    apiFetch<{ id: string; role: string; content: string; model?: string; created_at: string }>(
      '/api/ai/chat/',
      { method: 'POST', body: { content, model, scan_id: scanId } }
    ),
};
