# Firebase Production Configuration & Deployment Guide

## 1. Production Hosting (Vercel / Netlify / Railway)

Since you have hosted this application, you **MUST** configure the environment variables in your hosting provider's dashboard. **Do not commit `.env` files.**

### Frontend (Next.js on Vercel/Netlify)
Go to **Settings > Environment Variables** in your dashboard and add the following keys from your Firebase Console:

| Variable Name | Value Source (Firebase Console) |
|---------------|---------------------------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Project Settings > General > Web App Config |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Project Settings > General > Web App Config |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Project Settings > General > Web App Config |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Project Settings > General > Web App Config |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Project Settings > General > Web App Config |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Project Settings > General > Web App Config |

### Backend (FastAPI on Railway/Render/AWS)
Your backend needs admin privileges.

1.  **Generate Key:** Go to Firebase Console > Project Settings > Service Accounts > **Generate new private key**.
2.  **Copy Content:** Open the downloaded JSON file and copy the entire content.
3.  **Set Variable:** In your hosting dashboard (e.g., Railway Variables), create a new variable:

    *   **Key:** `FIREBASE_CREDENTIALS_JSON`
    *   **Value:** *(Paste the entire JSON content here)*

    *   **Key:** `DATABASE_URL`
    *   **Value:** `postgresql://...` (Your Neon connection string)

---

## 2. Cleanup Verification (Post-Deployment)

Ensure these steps were taken to successfully remove the old auth provider:

*   [x] `@clerk/nextjs` uninstall confirmed.
*   [x] `CLERK_` keys removed from all environment configurations.
*   [x] `npm build` passes without Clerk import errors.

## 3. Database Sync Strategy (Production)
In production, when a user signs up via Firebase:
1.  The **Frontend** receives the `User` object immediately.
2.  **Recommended:** Trigger a backend endpoint (e.g., `/api/users/sync`) passing the Firebase Token.
3.  **Backend:** Verifies token via Admin SDK -> Extracts `uid` -> Checks if exists in Postgres -> Creates User record if missing.
    *   *This ensures your Relational Data (Students/Faculty) stays linked to the Auth Identity.*
