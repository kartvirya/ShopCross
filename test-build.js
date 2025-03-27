#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Testing production build process...');

try {
  // Run the build command
  console.log('\n🔨 Running build command...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Check if the dist directory exists
  const distDir = path.join(__dirname, 'dist');
  if (!fs.existsSync(distDir)) {
    throw new Error('Build failed: dist directory not found');
  }
  
  // Check if the main JS file exists
  const indexFile = path.join(distDir, 'index.js');
  if (!fs.existsSync(indexFile)) {
    throw new Error('Build failed: index.js not found in dist directory');
  }
  
  console.log('\n✅ Build successful!');
  console.log('\nYour application is ready for deployment to Render.');
  console.log('Use the following settings in Render:');
  console.log('  - Build Command: npm run build');
  console.log('  - Start Command: node --experimental-modules start-production.js');
  
} catch (error) {
  console.error('\n❌ Build test failed:', error.message);
  process.exit(1);
}