# Google Authentication Setup Guide

## Prerequisites
- A Google Cloud Platform account
- Your application running on a domain (localhost is fine for development)

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - Choose **External** user type
   - Fill in the required fields (App name, User support email, Developer contact)
   - Add scopes: `email` and `profile`
   - Add test users if needed

## Step 2: Configure OAuth Client

1. Select **Web application** as the application type
2. Add **Authorized JavaScript origins**:
   - For development: `http://localhost:8080`
   - For production: `https://yourdomain.com`
3. Add **Authorized redirect URIs**:
   - For development: `http://localhost:8080`
   - For production: `https://yourdomain.com`
4. Click **Create**
5. Copy the **Client ID** (it will look like: `xxxxx.apps.googleusercontent.com`)

## Step 3: Add Client ID to Your Application

1. Open the `.env` file in your project root
2. Replace the placeholder with your actual Client ID:
   ```
   VITE_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
   ```
3. Save the file

## Step 4: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```
2. Navigate to the login page: `http://localhost:8080/login`
3. You should see the "Sign in with Google" button
4. Click it and select your Google account
5. After successful authentication, you'll be redirected to the home page

## Features Implemented

- **Google One-Tap Sign-In**: Automatic sign-in for returning users
- **Persistent Sessions**: User data is stored in localStorage
- **Bilingual Support**: All messages support English and Urdu
- **Protected Routes**: Emergency Contacts and Uploads pages require login for interactions
- **User Profile**: User's name, email, and profile picture are stored

## Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already added to `.gitignore`
- Use `.env.example` as a template for other developers
- For production, use environment variables from your hosting platform

## Troubleshooting

### "Invalid Client ID" Error
- Verify your Client ID is correct in the `.env` file
- Ensure you're using the correct domain in Google Cloud Console
- Restart your development server after changing `.env`

### Google Sign-In Button Not Showing
- Check browser console for errors
- Verify `@react-oauth/google` package is installed
- Ensure your Client ID is properly loaded

### Authentication Not Persisting
- Check browser's localStorage
- Verify AuthContext is properly wrapping your app
- Clear browser cache and try again
