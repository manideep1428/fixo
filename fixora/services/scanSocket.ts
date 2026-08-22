/**
 * WebSocket client for live scan progress.
 *
 * Connects to ws(s)://<API host>/ws/scans/<scanId>/ and emits
 * `{ progress, current_step, status, error }` events into a callback.
 */

import { API_BASE_URL } from './apiClient';

export interface ScanProgressEvent {
  id: string;
  website_id?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  current_step?: string;
  error?: string;
}

export function scanSocketUrl(scanId: string): string {
  const wsBase = API_BASE_URL.replace(/^http/, 'ws');
  return `${wsBase}/ws/scans/${scanId}/`;
}

export function connectScanSocket(
  scanId: string,
  onUpdate: (event: ScanProgressEvent) => void,
  onClose?: (clean: boolean) => void
): WebSocket {
  const socket = new WebSocket(scanSocketUrl(scanId));

  socket.onmessage = (message) => {
    try {
      const parsed = JSON.parse(message.data);
      if (parsed?.type === 'scan.update' && parsed.data) {
        onUpdate(parsed.data as ScanProgressEvent);
      }
    } catch {
      // ignore malformed frames
    }
  };

  // keepalive ping every 25s
  const pingInterval = setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'ping' }));
    }
  }, 25000);

  socket.onclose = () => {
    clearInterval(pingInterval);
    onClose?.(true);
  };

  socket.onerror = () => {
    clearInterval(pingInterval);
    onClose?.(false);
  };

  return socket;
}
