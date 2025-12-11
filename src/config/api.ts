// API Configuration
export const API_CONFIG = {
  // ngrok tunnel URL - update this when ngrok URL changes
  NGROK_BASE_URL: 'https://fb410d356bb4.ngrok-free.app',
  
  // API endpoints
  ENDPOINTS: {
    CHAT: '/chat',  // Updated to match your backend endpoint
    HEALTH: '/health',
  },
  
  // Request configuration
  REQUEST_CONFIG: {
    timeout: 30000, // 30 seconds
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
  },
} as const;