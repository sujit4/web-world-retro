#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

// Log with colors
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Execute a command and log output
function execute(command) {
  log(`\n${colors.bright}${colors.yellow}Executing: ${command}${colors.reset}\n`);
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    log(`\n${colors.red}Command failed: ${command}${colors.reset}\n`, colors.red);
    log(error.toString(), colors.red);
    return false;
  }
}

// Main build process
async function build() {
  log('Starting build process...', colors.green);

  // Check if TypeScript compiles
  log('Checking TypeScript compilation...', colors.yellow);
  if (!execute('npx tsc --noEmit')) {
    process.exit(1);
  }

  // Build the frontend
  log('Building frontend with Vite...', colors.yellow);
  if (!execute('npx vite build')) {
    log('Vite build failed, trying with --force-rebuild flag...', colors.yellow);
    if (!execute('npx vite build --force')) {
      process.exit(1);
    }
  }

  // Build the backend
  log('Building backend with esbuild...', colors.yellow);
  if (!execute('npx esbuild server/index.ts --platform=node --packages=external --external:vite --external:@vitejs/plugin-react --bundle --format=esm --outdir=api')) {
    process.exit(1);
  }

  // Ensure the api directory exists in the output directory
  const apiDir = path.join(process.cwd(), 'api');
  if (!fs.existsSync(apiDir)) {
    log('API directory not found, creating it...', colors.yellow);
    fs.mkdirSync(apiDir, { recursive: true });
  }

  log('Build completed successfully!', colors.green);
}

build().catch((error) => {
  log(`Build failed: ${error}`, colors.red);
  process.exit(1);
}); 