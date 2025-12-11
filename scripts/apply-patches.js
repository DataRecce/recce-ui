#!/usr/bin/env node

/**
 * Apply patches to fix TypeScript errors in the submodule source code
 * These are temporary fixes until the main repository is updated
 */

const fs = require('fs');
const path = require('path');

const patches = [
  {
    file: 'recce-source/js/src/components/check/CheckDetail.tsx',
    line: 133,
    original: '      runTypeEntry.RunResultView as RegistryEntry["RunResultView"];',
    replacement: '      runTypeEntry.RunResultView as any as RegistryEntry["RunResultView"];'
  },
  {
    file: 'recce-source/js/src/components/check/CheckList.tsx',
    line: 110,
    original: '                  mutate({ is_checked: details.checked });',
    replacement: '                  mutate({ is_checked: details.checked as boolean });'
  },
  {
    file: 'recce-source/js/src/components/lineage/LineageViewContextMenu.tsx',
    line: 151,
    original: '    (node?.data as LineageGraphNode | undefined)?.data.name,',
    replacement: '    (node?.data as any as LineageGraphNode | undefined)?.data.name,'
  },
  {
    file: 'recce-source/js/src/components/ui/toaster.tsx',
    line: 12,
    original: 'export const toaster = createToaster({',
    replacement: 'export const toaster: any = createToaster({'
  }
];

function applyPatch(patch) {
  const filePath = path.join(__dirname, '..', patch.file);

  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${patch.file}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes(patch.replacement)) {
    console.log(`✓ Patch already applied: ${patch.file}:${patch.line}`);
    return true;
  }

  if (!content.includes(patch.original)) {
    console.warn(`⚠ Original text not found in ${patch.file}:${patch.line}`);
    return false;
  }

  content = content.replace(patch.original, patch.replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Patch applied: ${patch.file}:${patch.line}`);
  return true;
}

console.log('Applying TypeScript patches...');
patches.forEach(applyPatch);
console.log('Patches applied successfully');