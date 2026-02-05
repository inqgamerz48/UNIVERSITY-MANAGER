# Firebase Production Configuration & Deployment Guide

## 1. Frontend: Vercel Environment Variables (Action Required)

Go to your Vercel Project Settings > Environment Variables.
**Delete** the old `CLERK_` variables.
**Add** these exact values (from your provided config):

| Variable Name | Value |
|---------------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyCXR7cBfUxRTootY6AcGhsNiR9hLzD_75k` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `uni-manager-bb9ab.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `uni-manager-bb9ab` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `uni-manager-bb9ab.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `769830083528` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:769830083528:web:cd39e9ae7bc21aaafffefd` |
| `NEXT_PUBLIC_API_URL` | `https://university-manager-64p3.onrender.com` (Your Render Backend URL) |

---

## 2. Backend: Render Environment Variables (Action Required)

Go to your Render Dashboard > Environment.
**Delete** these old variables:
*   `CLERK_PEM_PUBLIC_KEY`
*   `CLERK_SECRET_KEY`

**Add** this new variable:

| Variable Name | Value |
|---------------|-------|
| `FIREBASE_CREDENTIALS_JSON` | **[REQUIRES ACTION]** You must generate this from Firebase Console > Project Settings > Service Accounts. It is a long JSON string starting with `{"type": "service_account", ...}`. |

**Keep** these existing variables:
*   `DATABASE_URL` (Keep your Neon URL)
*   `CORS_ORIGINS` (Update to include your Vercel domain options if needed, e.g. `["https://your-vercel-app.vercel.app", "http://localhost:3000"]`)

---

## 3. Troubleshooting Deployment

### Render "No open ports detected" Error
If your Render deployment fails with this error, verify your "Start Command" in Render Settings > Settings:

*   **Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
*   *(Ensure it binds to 0.0.0.0, not localhost)*

### Vercel "Build Process" Error
If Vercel fails on `npm run build`:
*   Ensure you have removed `clerk` from `package.json` (We did this).
*   Ensure you have no duplicate routes (e.g. `sign-in/page.tsx` AND `sign-in/[[...sign-in]]`). (We fixed this).
