// Helper script to start the backend server

// Make sure to build the TypeScript files first with:
// npm run backend:build

// Then run this script with:
// node startBackend.js

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const distPath = path.join(__dirname, 'dist', 'backend', 'index.js');

// Check if the backend was built
if (!fs.existsSync(distPath)) {
  console.error('\x1b[31mError: Backend build not found.\x1b[0m');
  console.log('\x1b[33mPlease build the backend first with:\x1b[0m npm run backend:build');
  process.exit(1);
}

console.log('\x1b[36mStarting backend server...\x1b[0m');
console.log(`\x1b[36mPort: ${PORT}\x1b[0m`);

// Start the server process
const serverProcess = spawn('node', [distPath], {
  env: { ...process.env, PORT },
  stdio: 'inherit'
});

// Handle server process events
serverProcess.on('error', (error) => {
  console.error('\x1b[31mFailed to start backend server:\x1b[0m', error);
});

serverProcess.on('exit', (code) => {
  if (code !== 0) {
    console.error(`\x1b[31mBackend server exited with code ${code}\x1b[0m`);
  } else {
    console.log('\x1b[32mBackend server stopped\x1b[0m');
  }
});

// Handle termination signals
['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, () => {
    console.log('\x1b[33mShutting down backend server...\x1b[0m');
    serverProcess.kill(signal);
  });
});

console.log('\x1b[32mBackend server is running\x1b[0m');
console.log('\x1b[33mPress Ctrl+C to stop\x1b[0m'); 