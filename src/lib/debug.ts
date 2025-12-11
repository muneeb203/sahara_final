// Debug utilities for testing ngrok connection
import { API_CONFIG } from '@/config/api';

export async function testNgrokConnection() {
  console.log('🔍 Testing ngrok connection...');
  console.log('📍 Base URL:', API_CONFIG.NGROK_BASE_URL);
  
  // Test 1: Basic connectivity
  try {
    console.log('🌐 Testing basic connectivity...');
    const response = await fetch(API_CONFIG.NGROK_BASE_URL, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });
    console.log('✅ Basic connectivity:', response.status, response.statusText);
  } catch (error) {
    console.error('❌ Basic connectivity failed:', error);
  }

  // Test 2: Health endpoint
  try {
    console.log('🏥 Testing health endpoint...');
    const healthUrl = `${API_CONFIG.NGROK_BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`;
    console.log('📍 Health URL:', healthUrl);
    
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });
    console.log('✅ Health check:', response.status, response.statusText);
    
    if (response.ok) {
      const text = await response.text();
      console.log('📄 Health response:', text);
    }
  } catch (error) {
    console.error('❌ Health check failed:', error);
  }

  // Test 3: Chat endpoint structure
  try {
    console.log('💬 Testing chat endpoint structure...');
    const chatUrl = `${API_CONFIG.NGROK_BASE_URL}${API_CONFIG.ENDPOINTS.CHAT}`;
    console.log('📍 Chat URL:', chatUrl);
    
    const response = await fetch(chatUrl, {
      method: 'POST',
      headers: API_CONFIG.REQUEST_CONFIG.headers,
      body: JSON.stringify({
        message: 'What are my inheritance rights?'
      }),
    });
    console.log('✅ Chat endpoint response:', response.status, response.statusText);
    
    if (response.status !== 404) {
      try {
        const data = await response.json();
        console.log('📄 Chat response data:', data);
      } catch (e) {
        const text = await response.text();
        console.log('📄 Chat response text:', text);
      }
    }
  } catch (error) {
    console.error('❌ Chat endpoint test failed:', error);
  }
}

// Call this function from browser console to debug
(window as any).testNgrokConnection = testNgrokConnection;