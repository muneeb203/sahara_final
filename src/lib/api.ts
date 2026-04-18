import { API_CONFIG } from '@/config/api';

// API configuration for ngrok tunnel communication

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  conversation_history?: ChatMessage[];
  session_id?: string;
}

export interface ChatResponse {
  response?: string;
  sources?: unknown[];
  is_safety_response?: boolean;
  session_id?: string;
  detail?: string;
  error?: string;
}

export interface HealthResponse {
  status?: string;
  chatbot_initialized?: boolean;
}

export interface HealthStatus {
  online: boolean;
  initialized?: boolean;
  reason?: string;
}

const HEALTH_TIMEOUT_MS = 10000;
const CHAT_TIMEOUT_MS = API_CONFIG.REQUEST_CONFIG.timeout;

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

function getOrCreateSessionId(): string {
  const key = 'chat_session_id';
  const existing = sessionStorage.getItem(key);
  if (existing) return existing;

  const created =
    (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
      ? crypto.randomUUID()
      : `web-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  sessionStorage.setItem(key, created);
  return created;
}

/**
 * Check backend health using only /health endpoint.
 */
export async function checkBackendHealth(): Promise<HealthStatus> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_CONFIG.NGROK_BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      return { online: false, reason: `HTTP ${response.status}` };
    }

    const data: HealthResponse | null = await response.json().catch(() => null);
    if (!data || data.status !== 'ok') {
      return { online: false, reason: 'Invalid health payload' };
    }

    return { online: true, initialized: !!data.chatbot_initialized };
  } catch (error) {
    return {
      online: false,
      reason: isAbortError(error) ? 'Timeout' : String(error),
    };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Send a chat message to the AI assistant via ngrok tunnel.
 */
export async function sendChat(
  message: string,
  sessionId?: string
): Promise<ChatResponse> {
  const trimmed = (message || '').trim();
  if (!trimmed) {
    throw new Error('Message is required');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CHAT_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_CONFIG.NGROK_BASE_URL}${API_CONFIG.ENDPOINTS.CHAT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify({
        message: trimmed,
        session_id: sessionId || getOrCreateSessionId(),
      }),
      signal: controller.signal,
    });

    const contentType = response.headers.get('content-type') || '';
    const data: ChatResponse = contentType.includes('application/json')
      ? await response.json()
      : { detail: await response.text() };

    if (!response.ok) {
      throw new Error(data?.detail || `Chat failed (${response.status})`);
    }

    if (!data?.response) {
      throw new Error('Malformed chat response from backend');
    }

    return data;
  } catch (error) {
    if (isAbortError(error)) {
      throw new Error('Backend unreachable (timeout)');
    }
    throw new Error(error instanceof Error ? error.message : 'Failed to communicate with AI assistant');
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Backward-compatible wrapper used by existing UI.
 */
export async function checkApiHealth(): Promise<boolean> {
  const status = await checkBackendHealth();
  return status.online;
}

/**
 * Backward-compatible wrapper used by existing UI.
 */
export async function sendChatMessage(
  message: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  void conversationHistory;
  const data = await sendChat(message, getOrCreateSessionId());
  return data.response || 'No response received';
}