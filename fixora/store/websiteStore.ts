import { create } from 'zustand';
import type { Website, WebsiteCreatePayload } from '../types/website';
import { INITIAL_WEBSITES } from '../services/mockDataService';

interface WebsiteState {
  websites: Website[];
  selectedWebsiteId: string | null;
  searchQuery: string;
  filterStatus: string;
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: string) => void;
  setSelectedWebsite: (id: string | null) => void;
  addWebsite: (payload: WebsiteCreatePayload) => Website;
  updateWebsite: (id: string, updates: Partial<Website>) => void;
  deleteWebsite: (id: string) => void;
  rescanWebsite: (id: string) => void;
}

export const useWebsiteStore = create<WebsiteState>((set, get) => ({
  websites: INITIAL_WEBSITES,
  selectedWebsiteId: 'web-1',
  searchQuery: '',
  filterStatus: 'all',

  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setSelectedWebsite: (id) => set({ selectedWebsiteId: id }),

  addWebsite: (payload) => {
    const newSite: Website = {
      id: `web-${Date.now()}`,
      name: payload.name,
      url: payload.url.startsWith('http') ? payload.url : `https://${payload.url}`,
      status: 'active',
      owner: 'Current User',
      created_at: new Date().toISOString(),
      seo_score: Math.floor(Math.random() * 20) + 75,
      perf_score: Math.floor(Math.random() * 30) + 65,
      a11y_score: Math.floor(Math.random() * 15) + 82,
      overall_score: 80,
      total_issues: Math.floor(Math.random() * 8) + 2,
      tech_stack: ['Next.js', 'React', 'Tailwind CSS'],
    };
    set((state) => ({ websites: [newSite, ...state.websites] }));
    return newSite;
  },

  updateWebsite: (id, updates) => {
    set((state) => ({
      websites: state.websites.map((w) => (w.id === id ? { ...w, ...updates } : w)),
    }));
  },

  deleteWebsite: (id) => {
    set((state) => ({
      websites: state.websites.filter((w) => w.id !== id),
      selectedWebsiteId: state.selectedWebsiteId === id ? null : state.selectedWebsiteId,
    }));
  },

  rescanWebsite: (id) => {
    set((state) => ({
      websites: state.websites.map((w) =>
        w.id === id
          ? {
              ...w,
              status: 'scanning',
              last_scanned: 'Scanning in progress...',
            }
          : w
      ),
    }));

    // Simulate background scan completion
    setTimeout(() => {
      set((state) => ({
        websites: state.websites.map((w) =>
          w.id === id
            ? {
                ...w,
                status: 'active',
                last_scanned: 'Just now',
                seo_score: Math.min(100, (w.seo_score || 80) + 3),
                perf_score: Math.min(100, (w.perf_score || 70) + 5),
                a11y_score: Math.min(100, (w.a11y_score || 85) + 2),
                overall_score: Math.min(100, (w.overall_score || 80) + 3),
              }
            : w
        ),
      }));
    }, 4000);
  },
}));
