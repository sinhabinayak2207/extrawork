# Firebase Deployment Guide for B2B Showcase

This guide will walk you through deploying your Next.js application to Firebase Hosting.

## Prerequisites

1. Firebase account
2. Firebase CLI installed (`npm install -g firebase-tools`)
3. Google Cloud Platform project with OAuth credentials

## Step 1: Set Up Environment Variables

Create a `.env.local` file in the root of your project using the template provided in `env.template`:

```bash
cp env.template .env.local
```

Edit the `.env.local` file and fill in the following values:

- `NEXTAUTH_SECRET`: Generate a random string with `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: Get these from Google Cloud Console
- Firebase configuration is already filled in

## Step 2: Build the Application

```bash
npm run build
```

This will create an `out` directory with the static export of your Next.js application.

## Step 3: Deploy to Firebase

Login to Firebase (if not already logged in):

```bash
firebase login
```

Deploy the application:

```bash
firebase deploy
```

## Step 4: Set Up Google OAuth for Production

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Credentials
3. Edit your OAuth client
4. Add your Firebase hosting URL to the authorized JavaScript origins:
   ```
   https://b2bshowcase-199a8.web.app
   ```
5. Add your Firebase hosting URL with the callback path to authorized redirect URIs:
   ```
   https://b2bshowcase-199a8.web.app/api/auth/callback/google
   ```

## Step 5: Update Environment Variables for Production

In your `.env.local` file, update the `NEXTAUTH_URL` to your Firebase hosting URL:

```
NEXTAUTH_URL=https://b2bshowcase-199a8.web.app
```

Rebuild and redeploy your application.

## Troubleshooting

### API Routes Not Working

If your API routes are not working, make sure:

1. The `rewrites` section in `firebase.json` is correctly configured
2. You have set up Firebase Functions correctly

### Authentication Issues

If authentication is not working:

1. Check that your OAuth credentials are correct
2. Verify that the authorized domains in Google Cloud Console include your Firebase hosting domain
3. Ensure `NEXTAUTH_URL` is set correctly in your environment variables

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
