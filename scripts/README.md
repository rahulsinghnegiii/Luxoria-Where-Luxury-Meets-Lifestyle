# Admin Scripts

This directory contains utility scripts for administrative tasks in the e-commerce application.

## Setting Up

Before using these scripts, install dependencies:

```bash
npm run admin:prepare
# or directly:
cd scripts && npm install
```

## Promoting a User to Admin

### Option 1: Using Firebase Authentication (when NEXT_PUBLIC_USE_MOCK_SERVICES=false)

To promote a user to admin role when using Firebase:

```bash
npm run admin:promote <email> <password>
# or directly:
cd scripts && node run-promote-admin.js <email> <password>
```

This will:
1. Sign in with the provided email/password
2. Update the user's document in Firestore to set `role: "admin"`

### Option 2: Using Mock Services (when NEXT_PUBLIC_USE_MOCK_SERVICES=true)

To promote a user to admin role when using mock services:

```bash
npm run admin:mock <email>
# or directly:
cd scripts && node promote-mock-admin.js <email>
```

This will:
1. Check if the user exists in the mock user database
2. If found, update their role to admin
3. If not found, prompt to create a new admin user
4. Provide instructions to update localStorage in your browser

## Notes

- The scripts require the correct Firebase configuration in your `.env.local` file for live mode
- When using mock mode, you'll need to update your browser's localStorage for changes to take effect
- You must be using an email/password that can successfully authenticate with Firebase (for non-mock mode) 