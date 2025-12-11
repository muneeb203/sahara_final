# Ngrok Configuration for Chat Feature

This document explains how to configure the chat feature to work with your ngrok tunnel.

## Current Configuration

The chat feature is currently configured to use the ngrok URL: `https://38122d29f803.ngrok-free.app/`

## Updating the Ngrok URL

When you get a new ngrok URL, update it in the following file:

### File: `src/config/api.ts`

```typescript
export const API_CONFIG = {
  // Update this URL when ngrok URL changes
  NGROK_BASE_URL: 'https://YOUR-NEW-NGROK-URL.ngrok-free.app',
  // ... rest of config
}
```

## How It Works

1. **All chat requests** are sent to `{NGROK_BASE_URL}/api/chat`
2. **Health checks** are sent to `{NGROK_BASE_URL}/health`
3. **Connection status** is displayed in the chat interface
4. **Automatic retry** functionality when connection fails

## API Endpoints Expected

Your backend should provide these endpoints:

### POST `/api/chat`
```json
{
  "message": "User's question",
  "conversation_history": [
    {"role": "user", "content": "Previous message"},
    {"role": "assistant", "content": "Previous response"}
  ]
}
```

**Response:**
```json
{
  "response": "AI assistant's response",
  "error": "Optional error message"
}
```

### GET `/health`
Simple health check endpoint that returns 200 OK when the service is running.

## Features

- ✅ Real-time connection status indicator
- ✅ Automatic health checks on page load
- ✅ Retry connection functionality
- ✅ Error handling with fallback messages
- ✅ Conversation history support
- ✅ Bilingual error messages (English/Urdu)

## Troubleshooting

1. **Connection Failed**: Check if ngrok tunnel is running
2. **Wrong URL**: Update `NGROK_BASE_URL` in `src/config/api.ts`
3. **CORS Issues**: Ensure your backend allows requests from the frontend domain
4. **Timeout**: Requests timeout after 30 seconds (configurable in api.ts)