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
    '@tanstack/react-query',
    '@xyflow/react',
    'axios',
    'next',
    'next/link',
    'next/image',
    'next/router'
  ],
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