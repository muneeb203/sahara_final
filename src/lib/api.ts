import { API_CONFIG } from '@/config/api';

// API configuration for ngrok tunnel communication

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  conversation_history?: ChatMessage[];
}

export interface ChatResponse {
  response?: string;
  message?: string;  // Alternative response field
  reply?: string;    // Another common field name
  error?: string;
}

/**
 * Send a chat message to the AI assistant via ngrok tunnel
 */
export async function sendChatMessage(
  message: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  try {
    // Start with simple format, add conversation history if backend supports it
    const requestBody: ChatRequest = {
      message
      // Note: conversation_history commented out for now to match your backend
      // conversation_history: conversationHistory
    };

    const response = await fetch(`${API_CONFIG.NGROK_BASE_URL}${API_CONFIG.ENDPOINTS.CHAT}`, {
      method: 'POST',
      headers: API_CONFIG.REQUEST_CONFIG.headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChatResponse = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    // Handle different possible response field names
    return data.response || data.message || data.reply || 'No response received';
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to communicate with AI assistant'
    );
  }
}

/**
 * Health check for the ngrok tunnel
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_CONFIG.NGROK_BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
}