#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Find all bundled CSS files (tsdown generates hashed names like components-D2DRqJsz.css)
const distDir = path.join(__dirname, '../dist');
const allCssFiles = fs.readdirSync(distDir)
  .filter(f => f.endsWith('.css') && !f.startsWith('styles'));

// Separate global-styles files from other CSS files
// Global styles must be imported FIRST so CSS variables are defined before use
const globalStylesFiles = allCssFiles
  .filter(f => f.startsWith('global-styles'))
  .map(f => `./${f}`);

const otherCssFiles = allCssFiles
  .filter(f => !f.startsWith('global-styles'))
  .map(f => `./${f}`);

// Concatenate with global-styles first
const cssFiles = [...globalStylesFiles, ...otherCssFiles];

// Create styles.css that imports all component CSS
const importsContent = cssFiles
  .map(f => `@import '${f}';`)
  .join('\n');

fs.writeFileSync(
  path.join(distDir, 'styles.css'),
  importsContent,
  'utf-8'
);

console.log('✓ Created dist/styles.css with', cssFiles.length, 'CSS imports');
