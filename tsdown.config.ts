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
    'next-themes',
    // Externalize MUI so host app's ThemeProvider context is shared
    /^@mui\//,
    // Externalize all next.js imports (next, next/link, next/navigation, next/script, etc.)
    /^next($|\/)/,
  ],
  // Bundle html-to-image and html2canvas-pro (including dynamic subpath imports)
  // Using a function to catch subpath imports like 'html2canvas-pro/dist/html2canvas-pro.esm.js'
  noExternal: (id) => id === 'html-to-image' || id.startsWith('html2canvas-pro'),
  treeshake: true,
  minify: false,
  loader: {
    '.css': 'css'
  },
  alias: {
    // Override useAppRouter with our custom version that supports RouteConfigContext
    // This must come before the general '@' alias to take precedence
    '@/lib/hooks/useAppRouter': path.resolve(__dirname, 'src/lib/hooks/useAppRouter.ts'),
    // General aliases for OSS source
    '@': path.resolve(__dirname, 'recce-source/js/src'),
    'src': path.resolve(__dirname, 'recce-source/js/src'),
    'public': path.resolve(__dirname, 'recce-source/js/public'),
  },
  banner: {
    js: '"use client"',
  },
  target: false,
});
