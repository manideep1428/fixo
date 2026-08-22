/**
 * Base HTTP client for the Fixora Django backend.
 * - Base URL from NEXT_PUBLIC_API_URL (default http://localhost:8000)
 * - JWT access token stored in localStorage
 * - Every helper throws ApiError on non-2xx responses
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const TOKEN_KEY = 'fixora_access_token';
const REFRESH_KEY = 'fixora_refresh_token';

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(status: number, message: string, payload?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

export const tokenStorage = {
  get access(): string | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(TOKEN_KEY);
  },
  get refresh(): string | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(REFRESH_KEY);
  },
  set(access: string, refresh?: string) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(TOKEN_KEY, access);
    if (refresh) window.localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear() {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_KEY);
  },
};

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  skipAuth?: boolean;
}

async function refreshAccessToken(): Promise<boolean> {
  const refresh = tokenStorage.refresh;
  if (!refresh) return false;
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    tokenStorage.set(data.access, data.refresh ?? refresh);
    return true;
  } catch {
    return false;
  }
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, skipAuth, headers, ...rest } = options;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((headers as Record<string, string>) || {}),
  };
  if (!skipAuth && tokenStorage.access) {
    requestHeaders['Authorization'] = `Bearer ${tokenStorage.access}`;
  }

  const doFetch = () =>
    fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

  let res = await doFetch();

  // Retry once with a fresh token on 401
  if (res.status === 401 && !skipAuth && (await refreshAccessToken())) {
    requestHeaders['Authorization'] = `Bearer ${tokenStorage.access}`;
    res = await doFetch();
  }

  const text = await res.text();
  const payload = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new ApiError(res.status, payload?.detail || res.statusText, payload);
  }

  return payload as T;
}

/** True when the backend is reachable (used for graceful mock fallback). */
export async function isBackendUp(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/billing/plans/`, {
      method: 'GET',
      signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined,
    });
    return res.ok;
  } catch {
    return false;
  }
}
