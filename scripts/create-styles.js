#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Find all bundled CSS files (tsdown generates hashed names like components-D2DRqJsz.css)
const distDir = path.join(__dirname, '../dist');
const cssFiles = fs.readdirSync(distDir)
  .filter(f => f.endsWith('.css') && !f.startsWith('styles'))
  .map(f => `./${f}`);

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
