// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });
const { spawn } = require('child_process');
const path = require('path');

// Get email and password from command line arguments
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('Usage: node run-promote-admin.js <email> <password>');
  process.exit(1);
}

// Display environment variables for debugging (redacted)
console.log('Firebase config loaded:');
console.log(`- API Key: ${process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 5)}...`);
console.log(`- Project ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);
console.log(`- Auth Domain: ${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}`);

// Run the promotion script
console.log(`\nPromoting user ${email} to admin role...`);
const promotionScript = path.join(__dirname, 'promote-admin.js');
const child = spawn('node', [promotionScript, email, password], { 
  stdio: 'inherit',
  env: process.env 
});

child.on('exit', (code) => {
  if (code === 0) {
    console.log(`\nSuccessfully promoted ${email} to admin.`);
  } else {
    console.error(`\nFailed to promote ${email} to admin. Exit code: ${code}`);
  }
}); 