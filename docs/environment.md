# Environment

Create a local `.env` file from `.env.example` before running the app.

```sh
cp .env.example .env
```

All client-visible Expo variables must use the `EXPO_PUBLIC_` prefix.

## Variables

- `EXPO_PUBLIC_API_BASE_URL`: Backend API origin. Defaults to the production Vercel URL when omitted.
- `EXPO_PUBLIC_TMDB_API_KEY`: TMDB API key used by movie search and detail screens.
- `EXPO_PUBLIC_FIREBASE_API_KEY`: Firebase web API key.
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`: Firebase auth domain.
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`: Firebase project id.
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`: Firebase storage bucket.
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender id.
- `EXPO_PUBLIC_FIREBASE_APP_ID`: Firebase app id.

These values are bundled into the mobile client, so do not put server-only secrets in `EXPO_PUBLIC_` variables.
