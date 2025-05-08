// Script to promote a user to admin role
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, updateDoc, getDoc, setDoc } = require('firebase/firestore');

// Firebase configuration - make sure these values match your .env.local file
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to promote a user to admin
async function promoteToAdmin(email, password) {
  try {
    // First, sign in with the user's credentials
    console.log(`Signing in as ${email}...`);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log(`Successfully signed in. User ID: ${user.uid}`);
    
    // Check if user document exists
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      console.error('User document does not exist in Firestore. Creating one...');
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || email.split('@')[0],
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('User document created with admin role!');
    } else {
      // Update the user's role to admin
      console.log('Updating user role to admin...');
      await updateDoc(userRef, {
        role: 'admin',
        updatedAt: new Date()
      });
      console.log('User role updated to admin successfully!');
    }
    
    console.log(`User ${email} is now an admin.`);
    process.exit(0);
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    process.exit(1);
  }
}

// Get email and password from command line arguments
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('Usage: node promote-admin.js <email> <password>');
  process.exit(1);
}

// Run the promotion function
promoteToAdmin(email, password); 