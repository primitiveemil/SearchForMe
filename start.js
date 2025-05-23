// Script to start both the backend server and the Expo app

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const BACKEND_PORT = process.env.BACKEND_PORT || 3000;
const BACKEND_DEV_MODE = process.env.NODE_ENV !== 'production';

console.log('🚀 Starting AISearch app and backend server...');

// Check if node_modules/.bin exists
const binPath = path.join(__dirname, 'node_modules', '.bin');
const tsNodeDevPath = path.join(binPath, 'ts-node-dev');
const expoPath = path.join(binPath, 'expo');

// Helper to get the correct executable name for Windows
function getExecutable(basePath) {
  // On Windows, check for .cmd or .bat version first
  if (process.platform === 'win32') {
    if (fs.existsSync(`${basePath}.cmd`)) return `${basePath}.cmd`;
    if (fs.existsSync(`${basePath}.bat`)) return `${basePath}.bat`;
  }
  return basePath;
}

// Start backend server
let backendProcess;
if (BACKEND_DEV_MODE) {
  console.log('📡 Starting backend in development mode...');
  
  const tsNodeDevExe = getExecutable(tsNodeDevPath);
  
  backendProcess = spawn(
    'node', 
    [
      tsNodeDevExe,
      '--respawn',
      '--transpile-only',
      'src/backend/index.ts'
    ],
    {
      env: { ...process.env, PORT: BACKEND_PORT },
      stdio: 'pipe',
      shell: true
    }
  );
} else {
  console.log('📡 Starting backend in production mode...');
  backendProcess = spawn('node', ['dist/backend/index.js'], {
    env: { ...process.env, PORT: BACKEND_PORT },
    stdio: 'pipe'
  });
}

// Pipe backend output to console with prefix
backendProcess.stdout.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => console.log(`[Backend] ${line}`));
});

backendProcess.stderr.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => console.error(`[Backend Error] ${line}`));
});

// Start Expo app after a short delay to let backend initialize
setTimeout(() => {
  console.log('📱 Starting Expo app...');
  
  const expoExe = getExecutable(expoPath);
  
  const expoProcess = spawn(
    'node',
    [expoExe, 'start'],
    {
      stdio: 'inherit',
      shell: true
    }
  );
  
  expoProcess.on('error', (error) => {
    console.error('Failed to start Expo:', error);
    cleanup();
  });
  
  expoProcess.on('exit', (code) => {
    console.log(`Expo process exited with code ${code}`);
    cleanup();
  });
}, 3000);

// Handle process termination
function cleanup() {
  console.log('Shutting down backend server...');
  if (backendProcess) {
    backendProcess.kill();
  }
  process.exit();
}

['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, () => {
    console.log(`\nReceived ${signal}, shutting down...`);
    cleanup();
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  cleanup();
}); 