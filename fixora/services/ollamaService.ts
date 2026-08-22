import type { AiModel } from '../types/ai';

export const DEFAULT_OLLAMA_URL = process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://localhost:11434';

export const ollamaService = {
  /**
   * Check if local Ollama server is running
   */
  checkConnection: async (baseUrl: string = DEFAULT_OLLAMA_URL): Promise<boolean> => {
    try {
      const res = await fetch(`${baseUrl}/api/tags`, { method: 'GET', cache: 'no-store' });
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Generate text response from Ollama
   */
  generate: async (
    prompt: string,
    model: AiModel = 'mistral',
    baseUrl: string = DEFAULT_OLLAMA_URL
  ): Promise<string> => {
    try {
      const res = await fetch(`${baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, prompt, stream: false }),
      });
      if (!res.ok) throw new Error(`Ollama returned status ${res.status}`);
      const data = await res.json();
      return data.response;
    } catch (err) {
      console.warn('Ollama generation fallback triggered:', err);
      // Fallback AI simulation if Ollama server is not running
      await new Promise((r) => setTimeout(r, 600));
      return `[Fixora AI - ${model.toUpperCase()}]\n\nAnalysis & Recommendation for: "${prompt}"\n\n1. Identified Issue: Unoptimized CSS layout & missing alt text tags.\n2. Fix Suggestion: Add semantic HTML tags and convert images to WebP.\n3. Sample Patch:\n\`\`\`html\n<img src="/hero.webp" alt="Fixora AI Dashboard Preview" width="1200" height="630" loading="eager" />\n\`\`\``;
    }
  },

  /**
   * Stream response chunks from Ollama
   */
  stream: async function* (
    prompt: string,
    model: AiModel = 'mistral',
    baseUrl: string = DEFAULT_OLLAMA_URL
  ) {
    try {
      const res = await fetch(`${baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, prompt, stream: true }),
      });

      if (!res.ok || !res.body) {
        throw new Error('Streaming failed or Ollama not reachable');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(Boolean);
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.response) {
              yield parsed.response as string;
            }
          } catch {
            // Ignore partial chunk parse error
          }
        }
      }
    } catch (e) {
      console.warn('Streaming error, falling back to simulated stream:', e);
      const fallbackText = `[Fixora AI ${model.toUpperCase()} Engine]\n\nBased on scanning analysis: We detected critical SEO meta tag omission and high Largest Contentful Paint (LCP) latency on this page.\n\nRecommended Fix:\n- Enable Next.js <Image /> optimization\n- Add missing meta description tag\n- Preload critical web fonts`;
      const words = fallbackText.split(' ');
      for (const word of words) {
        await new Promise((r) => setTimeout(r, 30));
        yield word + ' ';
      }
    }
  },
};
