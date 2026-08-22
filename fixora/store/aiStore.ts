import { create } from 'zustand';
import type { AiFix, AiModel, AiChatMessage } from '../types/ai';
import { INITIAL_AI_FIXES } from '../services/mockDataService';

interface AiState {
  selectedModel: AiModel;
  ollamaUrl: string;
  isOllamaConnected: boolean;
  fixes: AiFix[];
  chatMessages: AiChatMessage[];
  setSelectedModel: (model: AiModel) => void;
  setOllamaUrl: (url: string) => void;
  setOllamaConnected: (connected: boolean) => void;
  applyFix: (id: string) => void;
  addChatMessage: (msg: Omit<AiChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
}

export const useAiStore = create<AiState>((set) => ({
  selectedModel: 'mistral',
  ollamaUrl: process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://localhost:11434',
  isOllamaConnected: false,
  fixes: INITIAL_AI_FIXES,
  chatMessages: [
    {
      id: 'msg-1',
      role: 'assistant',
      content: 'Hello! I am your local Fixora AI Assistant powered by Ollama (Mistral 7B & Llama 3.1 8B). Ask me any question about your website SEO, performance, accessibility or request custom code patches.',
      model: 'mistral',
      timestamp: new Date().toISOString(),
    },
  ],

  setSelectedModel: (model) => set({ selectedModel: model }),
  setOllamaUrl: (url) => set({ ollamaUrl: url }),
  setOllamaConnected: (connected) => set({ isOllamaConnected: connected }),

  applyFix: (id) => {
    set((state) => ({
      fixes: state.fixes.map((f) => (f.id === id ? { ...f, applied: true } : f)),
    }));
  },

  addChatMessage: (msg) => {
    const newMsg: AiChatMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({ chatMessages: [...state.chatMessages, newMsg] }));
  },

  clearChat: () =>
    set({
      chatMessages: [
        {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: 'Chat session reset. How can I help optimize your site?',
          timestamp: new Date().toISOString(),
        },
      ],
    }),
}));
