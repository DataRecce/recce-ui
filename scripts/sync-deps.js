#!/usr/bin/env node
/**
 * Syncs dependencies from recce-source/js to recce-ui
 * Run: node scripts/sync-deps.js
 */

const fs = require('fs');
const path = require('path');

const rootPkgPath = path.join(__dirname, '../package.json');
const sourcePkgPath = path.join(__dirname, '../recce-source/js/package.json');

const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
const sourcePkg = JSON.parse(fs.readFileSync(sourcePkgPath, 'utf8'));

// Dependencies that should stay as peerDependencies (provided by consuming apps)
const peerDeps = new Set(Object.keys(rootPkg.peerDependencies || {}));

// Dependencies that are specific to Next.js/SSR and shouldn't be in the UI library
const skipDeps = new Set([
  'next',
  '@next/third-parties',
  '@sentry/nextjs',
  '@tailwindcss/postcss',
  'postcss',
  'tailwindcss',
  '@babel/helpers',
  '@babel/runtime',
  '@fontsource/montserrat',
  'import-in-the-middle',
  'require-in-the-middle',
]);

// Sync dependencies from source
const newDeps = {};
for (const [dep, version] of Object.entries(sourcePkg.dependencies || {})) {
  if (!peerDeps.has(dep) && !skipDeps.has(dep)) {
    newDeps[dep] = version;
  }
}

// Sort dependencies alphabetically
const sortedDeps = Object.fromEntries(
  Object.entries(newDeps).sort(([a], [b]) => a.localeCompare(b))
);

rootPkg.dependencies = sortedDeps;

fs.writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2) + '\n');

console.log('✅ Dependencies synced from recce-source/js to recce-ui');
console.log(`   ${Object.keys(sortedDeps).length} dependencies updated`);
console.log('\n💡 Run `pnpm install` to update lockfile');
