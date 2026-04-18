// API Configuration
export const API_CONFIG = {
  // Backend base URL
  NGROK_BASE_URL: 'https://4fa8-2407-d000-17-2cfe-e551-d3f6-539f-975e.ngrok-free.app',
  
  // API endpoints
  ENDPOINTS: {
    CHAT: '/chat',  // Updated to match your backend endpoint
    HEALTH: '/health',
  },
  
  // Request configuration
  REQUEST_CONFIG: {
    timeout: 300000, // 5 minutes
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
} as const;