// make-admin.js - Script to make a specified user an admin
const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

// Initialize Firebase Admin with service account
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// Function to promote a user to admin
async function makeUserAdmin(userId) {
  if (!userId) {
    console.error('Error: User ID is required');
    return;
  }

  try {
    console.log(`Checking user ${userId}...`);
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.error(`Error: User ${userId} does not exist`);
      return;
    }

    const userData = userDoc.data();
    console.log(`Current user data:`, userData);

    // Update the user document with admin role
    await userRef.update({
      role: 'admin',
      isAdmin: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`✅ Successfully promoted user ${userId} to admin role`);
    
    // Verify the update
    const updatedUser = await userRef.get();
    console.log(`Updated user data:`, updatedUser.data());

  } catch (error) {
    console.error('Error promoting user to admin:', error);
  }
}

// Get the user ID from command line arguments
const userId = process.argv[2];
if (!userId) {
  console.error('Please provide a user ID as a command-line argument');
  console.log('Usage: node make-admin.js USER_ID');
  process.exit(1);
}

// Execute the function and then exit
makeUserAdmin(userId).then(() => {
  console.log('Done.');
  process.exit(0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 