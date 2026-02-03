#!/usr/bin/env node
/**
 * Post-install script to fix naming issues in @tezos-x packages
 * 
 * Issue: @tezos-x/octez.js-dapp-wallet package.json expects files named 
 * octez.js-dapp-wallet.* but the actual built files are named 
 * octez.js-beacon-wallet.*
 * 
 * This script creates symlinks to fix the issue until it's resolved upstream.
 */

const fs = require('fs');
const path = require('path');

const dappWalletPath = path.join(
  __dirname,
  '..',
  'node_modules',
  '@tezos-x',
  'octez.js-dapp-wallet',
  'dist'
);

const typesPath = path.join(dappWalletPath, 'types');

// Create symlinks for JavaScript files
const jsFiles = [
  { source: 'octez.js-beacon-wallet.umd.js', target: 'octez.js-dapp-wallet.umd.js' },
  { source: 'octez.js-beacon-wallet.es6.js', target: 'octez.js-dapp-wallet.es6.js' },
  { source: 'octez.js-beacon-wallet.umd.js.map', target: 'octez.js-dapp-wallet.umd.js.map' },
  { source: 'octez.js-beacon-wallet.es6.js.map', target: 'octez.js-dapp-wallet.es6.js.map' },
];

console.log('Fixing @tezos-x/octez.js-dapp-wallet package...');

jsFiles.forEach(({ source, target }) => {
  const sourcePath = path.join(dappWalletPath, source);
  const targetPath = path.join(dappWalletPath, target);
  
  // Remove existing symlink or file if it exists
  if (fs.existsSync(targetPath)) {
    fs.unlinkSync(targetPath);
  }
  
  // Create symlink if source exists
  if (fs.existsSync(sourcePath)) {
    fs.symlinkSync(source, targetPath);
    console.log(`Created symlink: ${target} -> ${source}`);
  }
});

// Create type definition re-export file
const typeDefPath = path.join(typesPath, 'octez.js-dapp-wallet.d.ts');
const typeDefContent = "export * from './octez.js-beacon-wallet';\n";

if (fs.existsSync(typesPath)) {
  fs.writeFileSync(typeDefPath, typeDefContent);
  console.log('Created type definition file: octez.js-dapp-wallet.d.ts');
}

console.log('Package fix completed successfully!');
