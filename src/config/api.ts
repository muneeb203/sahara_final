// API Configuration
export const API_CONFIG = {
  // Backend base URL
  NGROK_BASE_URL: 'https://1a9d-119-154-36-119.ngrok-free.app',
  
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
      Accept: 'application/json',
    },
  },
} as const;