// Script to promote a user to admin role in mock mode
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Path to store mock data
const mockDataPath = path.join(__dirname, '..', 'mock-data');
const mockUsersFilePath = path.join(mockDataPath, 'mock-users.json');

// Ensure mock data directory exists
if (!fs.existsSync(mockDataPath)) {
  fs.mkdirSync(mockDataPath, { recursive: true });
}

// Function to load existing mock users or create empty array
function loadMockUsers() {
  try {
    if (fs.existsSync(mockUsersFilePath)) {
      const data = fs.readFileSync(mockUsersFilePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading mock users file:', error);
  }
  return [];
}

// Function to save mock users
function saveMockUsers(users) {
  try {
    fs.writeFileSync(mockUsersFilePath, JSON.stringify(users, null, 2), 'utf-8');
    console.log('Mock users saved successfully!');
  } catch (error) {
    console.error('Error saving mock users:', error);
  }
}

// Function to promote user to admin
function promoteToAdmin(email) {
  const users = loadMockUsers();
  
  // Find user with matching email
  const userIndex = users.findIndex(user => user.email === email);
  
  if (userIndex === -1) {
    console.log(`\nUser with email ${email} not found.`);
    console.log('Available users:');
    users.forEach(user => {
      console.log(`- ${user.email} (${user.role})`);
    });
    
    rl.question('\nWould you like to create this user as admin? (y/n): ', answer => {
      if (answer.toLowerCase() === 'y') {
        createNewAdmin(email);
      } else {
        console.log('Operation cancelled.');
        rl.close();
      }
    });
    return;
  }
  
  // Update user role to admin
  users[userIndex].role = 'admin';
  saveMockUsers(users);
  
  console.log(`User ${email} has been promoted to admin!`);
  
  // Also update localStorage if we're in a browser environment
  console.log('\nIMPORTANT: To complete this process, you need to:');
  console.log('1. Start your application');
  console.log('2. Open your browser console');
  console.log('3. Run this command in the console:');
  console.log(`   localStorage.setItem('mockUsers', '${JSON.stringify(users)}');`);
  
  rl.close();
}

// Function to create a new admin user
function createNewAdmin(email) {
  rl.question('Enter a password for the new admin: ', password => {
    const users = loadMockUsers();
    
    // Create new admin user
    const newAdmin = {
      id: `user_${Date.now()}`,
      email: email,
      password: password,
      name: email.split('@')[0],
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    
    users.push(newAdmin);
    saveMockUsers(users);
    
    console.log(`New admin user created with email: ${email}`);
    
    // Instructions for localStorage update
    console.log('\nIMPORTANT: To complete this process, you need to:');
    console.log('1. Start your application');
    console.log('2. Open your browser console');
    console.log('3. Run this command in the console:');
    console.log(`   localStorage.setItem('mockUsers', '${JSON.stringify(users)}');`);
    
    rl.close();
  });
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.error('Usage: node promote-mock-admin.js <email>');
  rl.close();
  process.exit(1);
} else {
  promoteToAdmin(email);
} 