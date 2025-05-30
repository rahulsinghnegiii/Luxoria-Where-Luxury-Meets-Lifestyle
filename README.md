# E-Commerce Store with Next.js and Firebase

This is a full-stack e-commerce application built with Next.js 14 (App Router) and Firebase. The store features product listings, user authentication, shopping cart functionality, and a checkout process with Stripe integration in test mode.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- Firebase account
- Stripe account (for payment integration)

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd e-commerce-store
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   - Copy the `.env.local.example` file to `.env.local`
   - Update the values with your Firebase and Stripe credentials

### Firebase Setup

1. Create a new Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable the following services:
   - Authentication (Email/Password)
   - Firestore Database
   - Storage

3. Create a web app in your Firebase project and get the configuration values
4. Add the Firebase configuration values to your `.env.local` file
5. Set `NEXT_PUBLIC_USE_MOCK_SERVICES=false` in your `.env.local` file when ready to use Firebase

### Firestore Database Structure

Set up the following collections in your Firestore database:

- **products**: Store product information
  - Fields: name, description, price, images (array), category, features (array), rating, reviews, stock, createdAt

- **users**: Extended user profiles
  - Fields: uid, email, displayName, photoURL, role ('user' or 'admin'), createdAt

- **orders**: Order details
  - Fields: userId, items (array), total, status, shippingAddress, billingAddress, paymentId, createdAt

- **carts**: User cart data (for registered users)
  - Fields: userId, items (array), updatedAt

### Firestore Security Rules

Add the following security rules to your Firestore database:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products can be read by anyone but written only by admins
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // User data is accessible only to the respective user
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Orders can be created by authenticated users
    match /orders/{orderId} {
      allow read: if request.auth != null && (
        resource.data.userId == request.auth.uid || 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
      allow create: if request.auth != null;
      allow update: if request.auth != null && (
        resource.data.userId == request.auth.uid || 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
    }
    
    // Carts can be managed by their owners
    match /carts/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Features

- Product listings and filtering
- Product details with image gallery
- Shopping cart functionality
- User authentication
- Checkout process with Stripe
- Admin dashboard for product management

## Development Plan

See the [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md) file for the detailed development roadmap.

## License

[MIT](LICENSE)
#   L u x o r i a - W h e r e - L u x u r y - M e e t s - L i f e s t y l e  
 