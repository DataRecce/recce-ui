import { defineConfig } from 'tsdown';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    components: 'src/components/index.ts',
    api: 'src/api/index.ts',
    hooks: 'src/hooks/index.ts',
    types: 'src/types/index.ts'
  },
  platform: 'neutral',
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    '@chakra-ui/react',
    '@emotion/react',
    '@tanstack/react-query',
    '@xyflow/react',
    'axios',
    'next',
    'next/link',
    'next/image',
    'next/router'
  ],
  // Note: html2canvas-pro and html-to-image are intentionally NOT external
  // They need to be bundled because they use dynamic imports with subpaths
  noExternal: ['html2canvas-pro', 'html-to-image'],
  treeshake: true,
  minify: false,
  loader: {
    '.css': 'css'
  },
  alias: {
    '@': path.resolve(__dirname, 'recce-source/js/src'),
    'src': path.resolve(__dirname, 'recce-source/js/src'),
    'public': path.resolve(__dirname, 'recce-source/js/public')
  },
  banner: {
    js: '"use client"',
  },
  target: false,
});
