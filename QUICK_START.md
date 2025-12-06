# Quick Start - Google Authentication

## 🚀 Get Started in 3 Steps

### Step 1: Get Your Google Client ID
1. Go to https://console.cloud.google.com/
2. Create/select a project
3. Go to **APIs & Services** > **Credentials**
4. Create **OAuth client ID** (Web application)
5. Add authorized origins: `http://localhost:8080`
6. Copy your Client ID

### Step 2: Add Client ID to .env
Open `.env` file and replace the placeholder:
```env
VITE_GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com
```

### Step 3: Run Your App
```bash
npm run dev
```

Visit: http://localhost:8080/login

## ✨ What You'll See

- **Login Page**: "Sign in with Google" button at the top
- **After Login**: Your profile picture and name in the header
- **Protected Features**: Full access to Emergency Contacts and Uploads

## 🔒 Security

- `.env` is already in `.gitignore`
- Never commit your Client ID to version control
- User sessions are stored securely in localStorage

## 📚 Need More Details?

- Full setup guide: `GOOGLE_AUTH_SETUP.md`
- Implementation details: `IMPLEMENTATION_SUMMARY.md`

## ❓ Troubleshooting

**Button not showing?**
- Check if Client ID is in `.env`
- Restart dev server after changing `.env`

**"Invalid Client ID" error?**
- Verify Client ID is correct
- Check authorized origins in Google Console

**Still having issues?**
- Check browser console for errors
- Verify `@react-oauth/google` is installed: `npm list @react-oauth/google`
