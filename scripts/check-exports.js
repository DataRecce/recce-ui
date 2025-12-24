#!/usr/bin/env node

/**
 * Export Check Script
 *
 * Compares available components in recce-source with current exports
 * to detect new components that could be exported or stale exports.
 *
 * Usage: node scripts/check-exports.js
 */

const fs = require('fs');
const path = require('path');

const RECCE_SOURCE_COMPONENTS = path.join(__dirname, '../recce-source/js/src/components');
const RECCE_SOURCE_HOOKS = path.join(__dirname, '../recce-source/js/src/lib/hooks');
const COMPONENTS_INDEX = path.join(__dirname, '../src/components/index.ts');
const HOOKS_INDEX = path.join(__dirname, '../src/hooks/index.ts');

// Directories to skip (tests, internal utilities, etc.)
const SKIP_DIRS = ['__tests__', 'routing', 'onboarding-guide', 'AuthModal'];
const SKIP_FILES = ['.test.tsx', '.test.ts', '.spec.tsx', '.spec.ts', 'styles.tsx'];

/**
 * Recursively find all .tsx files in a directory
 */
function findTsxFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!SKIP_DIRS.includes(item)) {
        findTsxFiles(fullPath, files);
      }
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      // Skip test files and non-component files
      if (!SKIP_FILES.some(skip => item.includes(skip))) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

/**
 * Extract exported names from a TypeScript file
 */
function getExportsFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const exports = [];

  // Match: export function Name, export const Name, export class Name
  const namedExportRegex = /export\s+(?:function|const|class|interface|type|enum)\s+(\w+)/g;
  let match;
  while ((match = namedExportRegex.exec(content)) !== null) {
    exports.push({ name: match[1], type: 'named' });
  }

  // Match: export default function Name or export default Name
  const defaultExportRegex = /export\s+default\s+(?:function\s+)?(\w+)/g;
  while ((match = defaultExportRegex.exec(content)) !== null) {
    if (match[1] !== 'function') {
      exports.push({ name: match[1], type: 'default' });
    }
  }

  // Match: export { Name } or export { Name as Alias }
  const reExportRegex = /export\s*\{([^}]+)\}/g;
  while ((match = reExportRegex.exec(content)) !== null) {
    const names = match[1].split(',').map(n => n.trim().split(/\s+as\s+/)[0].trim());
    names.forEach(name => {
      if (name && !name.startsWith('type ')) {
        exports.push({ name, type: 'named' });
      }
    });
  }

  return exports;
}

/**
 * Get relative path for display
 */
function getRelativePath(fullPath, baseDir) {
  return fullPath.replace(baseDir, '').replace(/^\//, '');
}

/**
 * Parse current exports from index.ts file
 */
function parseCurrentExports(indexPath) {
  if (!fs.existsSync(indexPath)) return new Set();

  const content = fs.readFileSync(indexPath, 'utf-8');
  const imports = new Set();

  // Match import paths like '@/components/lineage/LineageView'
  const importRegex = /from\s+['"](@\/[^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.add(match[1]);
  }

  // Also track wildcard exports like 'export * from'
  const wildcardRegex = /export\s+\*\s+from\s+['"](@\/[^'"]+)['"]/g;
  while ((match = wildcardRegex.exec(content)) !== null) {
    imports.add(match[1] + '/*'); // Mark as wildcard
  }

  return imports;
}

/**
 * Convert file path to @/ import path
 */
function filePathToImportPath(filePath, sourceRoot) {
  const relative = filePath
    .replace(sourceRoot, '')
    .replace(/^\//, '')
    .replace(/\.(tsx?|jsx?)$/, '');
  return `@/${relative}`;
}

/**
 * Check if a file has meaningful exports (components, hooks, etc.)
 */
function hasMeaningfulExports(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Check for React component patterns
  const hasComponent = /export\s+(default\s+)?function\s+\w+.*\(/.test(content) ||
                       /export\s+const\s+\w+\s*[=:]\s*\(/.test(content) ||
                       /export\s+const\s+\w+\s*=\s*React\./.test(content);

  // Check for hooks
  const hasHook = /export\s+(function|const)\s+use\w+/.test(content);

  // Check for context/provider
  const hasContext = /createContext|Provider/.test(content);

  // Check for types that might be useful
  const hasTypes = /export\s+(interface|type)\s+\w+/.test(content);

  return hasComponent || hasHook || hasContext || hasTypes;
}

/**
 * Main function
 */
function main() {
  console.log('\n📦 Export Check Report\n');
  console.log('='.repeat(60) + '\n');

  // Check components
  console.log('🔍 Checking components...\n');

  const componentFiles = findTsxFiles(RECCE_SOURCE_COMPONENTS);
  const currentComponentExports = parseCurrentExports(COMPONENTS_INDEX);

  const availableComponents = new Map();
  const sourceRoot = path.join(__dirname, '../recce-source/js/src');

  for (const file of componentFiles) {
    if (hasMeaningfulExports(file)) {
      const importPath = filePathToImportPath(file, sourceRoot);
      const exports = getExportsFromFile(file);
      if (exports.length > 0) {
        availableComponents.set(importPath, {
          file: getRelativePath(file, RECCE_SOURCE_COMPONENTS),
          exports
        });
      }
    }
  }

  // Find new components (available but not exported)
  const newComponents = [];
  for (const [importPath, info] of availableComponents) {
    // Check if directly exported or covered by a wildcard export
    const isExported = currentComponentExports.has(importPath);
    const isCoveredByWildcard = Array.from(currentComponentExports).some(exp => {
      if (exp.endsWith('/*')) {
        const wildcardDir = exp.slice(0, -2); // Remove '/*'
        return importPath.startsWith(wildcardDir + '/') || importPath === wildcardDir;
      }
      return false;
    });

    if (!isExported && !isCoveredByWildcard) {
      newComponents.push({ importPath, ...info });
    }
  }

  // Find stale exports (exported but file doesn't exist or has no exports)
  const staleExports = [];
  for (const importPath of currentComponentExports) {
    // Skip wildcard exports for stale check
    if (importPath.endsWith('/*')) continue;

    if (importPath.startsWith('@/components/') && !availableComponents.has(importPath)) {
      // Check if file actually exists
      const filePath = importPath
        .replace('@/', path.join(__dirname, '../recce-source/js/src/'))
        + '.tsx';
      const filePathTs = filePath.replace('.tsx', '.ts');
      const indexPath = importPath
        .replace('@/', path.join(__dirname, '../recce-source/js/src/'))
        + '/index.tsx';

      if (!fs.existsSync(filePath) && !fs.existsSync(filePathTs) && !fs.existsSync(indexPath)) {
        staleExports.push(importPath);
      }
    }
  }

  // Report
  console.log(`✅ Currently exported: ${currentComponentExports.size} component paths\n`);

  if (newComponents.length > 0) {
    console.log(`⚠️  New components available (${newComponents.length} not exported):\n`);

    // Group by directory
    const grouped = {};
    for (const comp of newComponents) {
      const dir = path.dirname(comp.importPath).replace('@/components/', '');
      if (!grouped[dir]) grouped[dir] = [];
      grouped[dir].push(comp);
    }

    for (const [dir, comps] of Object.entries(grouped).sort()) {
      console.log(`   📁 ${dir}/`);
      for (const comp of comps) {
        const exportNames = comp.exports.map(e => e.name).join(', ');
        console.log(`      - ${path.basename(comp.importPath)}`);
        console.log(`        Exports: ${exportNames}`);
      }
      console.log();
    }
  } else {
    console.log('✅ All available components are exported!\n');
  }

  if (staleExports.length > 0) {
    console.log(`❌ Stale exports (${staleExports.length} no longer exist):\n`);
    for (const exp of staleExports) {
      console.log(`   - ${exp}`);
    }
    console.log();
  }

  // Check hooks
  console.log('\n' + '='.repeat(60) + '\n');
  console.log('🔍 Checking hooks...\n');

  const hookFiles = findTsxFiles(RECCE_SOURCE_HOOKS);
  const currentHookExports = parseCurrentExports(HOOKS_INDEX);

  const availableHooks = new Map();

  for (const file of hookFiles) {
    const importPath = filePathToImportPath(file, sourceRoot);
    const exports = getExportsFromFile(file);
    if (exports.length > 0) {
      availableHooks.set(importPath, {
        file: getRelativePath(file, RECCE_SOURCE_HOOKS),
        exports
      });
    }
  }

  const newHooks = [];
  for (const [importPath, info] of availableHooks) {
    if (!currentHookExports.has(importPath)) {
      newHooks.push({ importPath, ...info });
    }
  }

  console.log(`✅ Currently exported: ${currentHookExports.size} hook paths\n`);

  if (newHooks.length > 0) {
    console.log(`⚠️  New hooks available (${newHooks.length} not exported):\n`);
    for (const hook of newHooks) {
      const exportNames = hook.exports.map(e => e.name).join(', ');
      console.log(`   - ${hook.importPath}`);
      console.log(`     Exports: ${exportNames}\n`);
    }
  } else {
    console.log('✅ All available hooks are exported!\n');
  }

  // Summary
  console.log('='.repeat(60));
  console.log('\n📊 Summary:\n');
  console.log(`   Components: ${newComponents.length} new, ${staleExports.length} stale`);
  console.log(`   Hooks: ${newHooks.length} new`);

  if (newComponents.length > 0 || newHooks.length > 0 || staleExports.length > 0) {
    console.log('\n💡 Run this after updating recce-source to find new exports.\n');
    process.exit(1);
  } else {
    console.log('\n✨ All exports are up to date!\n');
    process.exit(0);
  }
}

main();
