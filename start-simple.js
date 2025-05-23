// A simpler script to start both the backend server and the Expo app
// This uses npm run commands directly which is more reliable across platforms

const { execSync } = require('child_process');
const readline = require('readline');

console.log('🚀 Starting AISearch app and backend server...');

// Function to handle user input for quitting
function setupQuitHandler() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\n✨ Press Q and Enter at any time to quit both servers');
  
  rl.on('line', (input) => {
    if (input.toLowerCase() === 'q') {
      console.log('Shutting down...');
      process.exit(0);
    }
  });
}

try {
  // Start the backend server in a new console window
  console.log('📡 Starting backend server...');
  
  if (process.platform === 'win32') {
    // Windows - use start cmd
    execSync('start cmd.exe /K npm run backend:dev', { 
      stdio: 'inherit',
      windowsHide: false
    });
  } else {
    // Mac/Linux - use terminal
    execSync('osascript -e \'tell app "Terminal" to do script "cd $PWD && npm run backend:dev"\'', {
      stdio: 'inherit'
    });
  }
  
  console.log('Backend server started in a new window');
  
  // Small delay before starting Expo
  console.log('Waiting for backend to initialize...');
  setTimeout(() => {
    console.log('📱 Starting Expo app...');
    
    // Run Expo in the current window
    try {
      setupQuitHandler();
      execSync('npm start', { 
        stdio: 'inherit'
      });
    } catch (err) {
      // This will trigger if the user stops Expo with Ctrl+C
      console.log('Expo app stopped.');
    }
  }, 2000);
  
} catch (error) {
  console.error('Error starting the app:', error.message);
  process.exit(1);
} 