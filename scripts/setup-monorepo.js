#!/usr/bin/env node

/**
 * Monorepo Setup Script
 *
 * This script helps set up the FlowMind monorepo for development:
 * 1. Installs all dependencies
 * 2. Initializes Husky git hooks
 * 3. Builds the shared package
 * 4. Verifies the setup
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function exec(command, options = {}) {
  try {
    execSync(command, { stdio: 'inherit', ...options });
    return true;
  } catch (error) {
    return false;
  }
}

function checkNodeVersion() {
  const version = process.version;
  const major = parseInt(version.slice(1).split('.')[0]);

  if (major < 20) {
    log('❌ Node.js version 20 or higher is required', colors.red);
    log(`   Current version: ${version}`, colors.yellow);
    process.exit(1);
  }

  log(`✓ Node.js version: ${version}`, colors.green);
}

function installDependencies() {
  log('\n📦 Installing dependencies...', colors.blue);

  if (!exec('npm install')) {
    log('❌ Failed to install dependencies', colors.red);
    process.exit(1);
  }

  log('✓ Dependencies installed', colors.green);
}

function initializeHusky() {
  log('\n🪝 Initializing Husky git hooks...', colors.blue);

  if (!exec('npm run prepare')) {
    log('⚠️  Failed to initialize Husky (this is okay if not in a git repo)', colors.yellow);
    return;
  }

  // Make hooks executable
  const hooksDir = path.join(__dirname, '..', '.husky');
  if (fs.existsSync(hooksDir)) {
    const hooks = ['pre-commit', 'commit-msg'];
    hooks.forEach(hook => {
      const hookPath = path.join(hooksDir, hook);
      if (fs.existsSync(hookPath)) {
        fs.chmodSync(hookPath, '755');
      }
    });
  }

  log('✓ Husky initialized', colors.green);
}

function buildSharedPackage() {
  log('\n🔨 Building shared package...', colors.blue);

  if (!exec('npm run build:shared')) {
    log('❌ Failed to build shared package', colors.red);
    process.exit(1);
  }

  log('✓ Shared package built', colors.green);
}

function verifySetup() {
  log('\n🔍 Verifying setup...', colors.blue);

  const checks = [
    {
      name: 'Frontend node_modules',
      path: path.join(__dirname, '..', 'frontend', 'node_modules'),
    },
    {
      name: 'Backend node_modules',
      path: path.join(__dirname, '..', 'backend', 'node_modules'),
    },
    {
      name: 'Shared node_modules',
      path: path.join(__dirname, '..', 'shared', 'node_modules'),
    },
    {
      name: 'Shared dist',
      path: path.join(__dirname, '..', 'shared', 'dist'),
    },
  ];

  let allPassed = true;
  checks.forEach(check => {
    if (fs.existsSync(check.path)) {
      log(`  ✓ ${check.name}`, colors.green);
    } else {
      log(`  ✗ ${check.name}`, colors.red);
      allPassed = false;
    }
  });

  if (!allPassed) {
    log('\n⚠️  Some checks failed', colors.yellow);
    return false;
  }

  log('\n✓ All checks passed', colors.green);
  return true;
}

function printNextSteps() {
  log('\n' + '='.repeat(60), colors.blue);
  log('🎉 Monorepo setup complete!', colors.green);
  log('='.repeat(60), colors.blue);

  log('\n📚 Next steps:', colors.blue);
  log('  1. Start development servers:');
  log('     npm run dev', colors.yellow);
  log('');
  log('  2. Or start individually:');
  log('     npm run dev:frontend  # Start frontend only', colors.yellow);
  log('     npm run dev:backend   # Start backend only', colors.yellow);
  log('');
  log('  3. Run tests:');
  log('     npm test', colors.yellow);
  log('');
  log('  4. Build for production:');
  log('     npm run build', colors.yellow);
  log('');
  log('📖 For more information, see MONOREPO_SETUP.md', colors.blue);
  log('');
}

// Main execution
async function main() {
  log('🚀 FlowMind Monorepo Setup', colors.blue);
  log('='.repeat(60), colors.blue);

  checkNodeVersion();
  installDependencies();
  initializeHusky();
  buildSharedPackage();

  if (verifySetup()) {
    printNextSteps();
  } else {
    log('\n❌ Setup incomplete. Please check the errors above.', colors.red);
    process.exit(1);
  }
}

main().catch(error => {
  log(`\n❌ Setup failed: ${error.message}`, colors.red);
  process.exit(1);
});
