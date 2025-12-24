import { defineConfig } from 'tsup';
import path from 'path';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    components: 'src/components/index.ts',
    api: 'src/api/index.ts',
    hooks: 'src/hooks/index.ts',
    types: 'src/types/index.ts'
  },
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    '@chakra-ui/react',
    '@emotion/react',
    '@mui/material',
    '@tanstack/react-query',
    '@xyflow/react',
    '@amplitude/unified',
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
  splitting: false,
  minify: false,
  bundle: true,
  loader: {
    '.css': 'copy'
  },
  esbuildOptions(options) {
    options.banner = {
      js: '"use client"'
    };
    options.alias = {
      '@': path.resolve(__dirname, 'recce-source/js/src'),
      'src': path.resolve(__dirname, 'recce-source/js/src'),
      'public': path.resolve(__dirname, 'recce-source/js/public')
    };
    options.external = [
      ...options.external || [],
      'simplebar/dist/simplebar.min.css',
      'src/components/query/styles.css'
    ];
  }
});