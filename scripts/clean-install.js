#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Cleaning FlowMind monorepo...\n');

// Directories to clean
const dirsToClean = [
  'node_modules',
  'frontend/node_modules',
  'backend/node_modules',
  'shared/node_modules',
  'frontend/dist',
  'backend/dist',
  'shared/dist',
  'pnpm-lock.yaml',
  'frontend/pnpm-lock.yaml',
  'backend/pnpm-lock.yaml',
  'shared/pnpm-lock.yaml',
];

// Remove directories
dirsToClean.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(fullPath)) {
    console.log(`Removing ${dir}...`);
    fs.rmSync(fullPath, { recursive: true, force: true });
  }
});

console.log('\n✅ Cleanup complete!\n');
console.log('📦 Installing dependencies with pnpm...\n');

try {
  execSync('pnpm install', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  console.log('\n✅ Installation complete!');
  console.log('\n🚀 You can now run: pnpm dev');
} catch (error) {
  console.error('\n❌ Installation failed:', error.message);
  process.exit(1);
}
