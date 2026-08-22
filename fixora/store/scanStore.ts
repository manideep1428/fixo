import { create } from 'zustand';
import type { ScanJob } from '../types/scanner';

interface ScanState {
  scans: ScanJob[];
  activeScanId: string | null;
  startScan: (websiteId: string, websiteName: string, url: string) => ScanJob;
  updateScanProgress: (id: string, progress: number, step?: string) => void;
  completeScan: (id: string) => void;
  failScan: (id: string, error: string) => void;
}

export const useScanStore = create<ScanState>((set, get) => ({
  scans: [
    {
      id: 'scan-001',
      website_id: 'web-1',
      website_name: 'Fixora SaaS App',
      url: 'https://fixora.ai',
      status: 'completed',
      progress: 100,
      started_at: '2025-02-01T14:28:00Z',
      finished_at: '2025-02-01T14:30:00Z',
      current_step: 'Completed scan & generated AI fixes',
    },
    {
      id: 'scan-002',
      website_id: 'web-2',
      website_name: 'Acme E-Commerce Store',
      url: 'https://store.acme-corp.com',
      status: 'completed',
      progress: 100,
      started_at: '2025-02-01T09:12:00Z',
      finished_at: '2025-02-01T09:15:00Z',
      current_step: 'Analysis stored in CockroachDB cache',
    },
  ],
  activeScanId: null,

  startScan: (websiteId, websiteName, url) => {
    const scanId = `scan-${Date.now()}`;
    const newJob: ScanJob = {
      id: scanId,
      website_id: websiteId,
      website_name: websiteName,
      url,
      status: 'running',
      progress: 5,
      current_step: 'Initializing Playwright & Chromium browser...',
      started_at: new Date().toISOString(),
    };

    set((state) => ({
      scans: [newJob, ...state.scans],
      activeScanId: scanId,
    }));

    // Step-by-step progress simulation
    const steps = [
      { progress: 20, step: 'Fetching HTML & running DOM visual tree audit...' },
      { progress: 45, step: 'Evaluating Lighthouse Core Web Vitals & LCP metrics...' },
      { progress: 70, step: 'Testing WCAG 2.1 AAA accessibility rules...' },
      { progress: 88, step: 'Executing Ollama AI model to generate code patches...' },
      { progress: 100, step: 'Scan complete! Analysis report generated.' },
    ];

    steps.forEach((s, idx) => {
      setTimeout(() => {
        if (s.progress === 100) {
          get().completeScan(scanId);
        } else {
          get().updateScanProgress(scanId, s.progress, s.step);
        }
      }, (idx + 1) * 1200);
    });

    return newJob;
  },

  updateScanProgress: (id, progress, step) => {
    set((state) => ({
      scans: state.scans.map((s) =>
        s.id === id ? { ...s, progress, current_step: step || s.current_step } : s
      ),
    }));
  },

  completeScan: (id) => {
    set((state) => ({
      scans: state.scans.map((s) =>
        s.id === id
          ? {
              ...s,
              status: 'completed',
              progress: 100,
              finished_at: new Date().toISOString(),
              current_step: 'Scan completed successfully.',
            }
          : s
      ),
      activeScanId: state.activeScanId === id ? null : state.activeScanId,
    }));
  },

  failScan: (id, error) => {
    set((state) => ({
      scans: state.scans.map((s) =>
        s.id === id ? { ...s, status: 'failed', error, current_step: `Failed: ${error}` } : s
      ),
      activeScanId: state.activeScanId === id ? null : state.activeScanId,
    }));
  },
}));
