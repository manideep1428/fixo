import { create } from 'zustand';
import type { Website, WebsiteCreatePayload } from '../types/website';
import { INITIAL_WEBSITES } from '../services/mockDataService';
import { websitesApi } from '../services/backendService';
import { connectScanSocket, type ScanProgressEvent } from '../services/scanSocket';

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
  fetchWebsites: () => Promise<void>;
}

export const useWebsiteStore = create<WebsiteState>((set, get) => ({
  websites: INITIAL_WEBSITES,
  selectedWebsiteId: 'web-1',
  searchQuery: '',
  filterStatus: 'all',

  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setSelectedWebsite: (id) => set({ selectedWebsiteId: id }),

  /** Pull the user's real websites from the backend (no-op when offline). */
  fetchWebsites: async () => {
    try {
      const websites = await websitesApi.list();
      if (Array.isArray(websites) && websites.length > 0) {
        set({ websites });
      }
    } catch {
      // Backend unreachable — keep current (mock) data.
    }
  },

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

    // Persist to backend; swap in the server record on success.
    websitesApi
      .create({ name: newSite.name, url: newSite.url })
      .then((created) =>
        set((state) => ({
          websites: state.websites.map((w) => (w.id === newSite.id ? created : w)),
        }))
      )
      .catch(() => undefined);

    return newSite;
  },

  updateWebsite: (id, updates) => {
    set((state) => ({
      websites: state.websites.map((w) => (w.id === id ? { ...w, ...updates } : w)),
    }));
    websitesApi.update(id, updates).catch(() => undefined);
  },

  deleteWebsite: (id) => {
    set((state) => ({
      websites: state.websites.filter((w) => w.id !== id),
      selectedWebsiteId: state.selectedWebsiteId === id ? null : state.selectedWebsiteId,
    }));
    websitesApi.remove(id).catch(() => undefined);
  },

  rescanWebsite: (id) => {
    const website = get().websites.find((w) => w.id === id);
    if (!website) return;

    set((state) => ({
      websites: state.websites.map((w) =>
        w.id === id ? { ...w, status: 'scanning', last_scanned: 'Scanning in progress...' } : w
      ),
    }));

    const applyProgress = (event: ScanProgressEvent) => {
      if (event.status === 'completed') {
        set((state) => ({
          websites: state.websites.map((w) => (w.id === id ? { ...w, status: 'active' } : w)),
        }));
      } else if (event.status === 'failed') {
        set((state) => ({
          websites: state.websites.map((w) => (w.id === id ? { ...w, status: 'error' } : w)),
        }));
      }
    };

    // Real scan via backend API + live WebSocket progress
    import('../services/backendService')
      .then(({ scansApi }) => scansApi.start(id))
      .then((scanJob) => {
        connectScanSocket(scanJob.id, applyProgress);
      })
      .catch(() => {
        // Offline fallback — simulate completion locally
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
      });
  },
}));
