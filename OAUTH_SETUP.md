# OAuth Provider Setup Guide

This guide will help you configure Google and GitHub OAuth providers for your Real Estate Platform.

## Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure the OAuth consent screen first if prompted
6. Set application type to "Web application"
7. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://your-domain.com/api/auth/callback/google` (for production)
8. Copy the Client ID and Client Secret

## GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - Application name: Real Estate Platform
   - Homepage URL: `http://localhost:3000` (for development)
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy the Client ID and generate a Client Secret

## Environment Configuration

Create a `.env.local` file in your project root:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-a-strong-one

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# Database (optional - using JWT by default)
DATABASE_URL="postgresql://username:password@localhost:5432/real_estate_db?schema=public"
```

## Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

## Testing Authentication

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Click "Sign In" and test both providers
4. Check that sessions persist across page reloads

## Production Deployment

For production deployment on Vercel:

1. Set all environment variables in your Vercel dashboard
2. Update the redirect URIs in your OAuth apps to use your production domain
3. Ensure NEXTAUTH_URL points to your production URL

## Troubleshooting

- **"Configuration" error**: Check that all environment variables are set correctly
- **"AccessDenied" error**: Verify your OAuth app settings and redirect URIs
- **"Verification" error**: Check that your NEXTAUTH_SECRET is set and consistent

For more information, visit the [NextAuth.js documentation](https://next-auth.js.org/).