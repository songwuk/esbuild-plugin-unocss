import { defineConfig } from 'tsup'
export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  format: ['cjs', 'esm'],
  sourcemap: false,
  clean: true,
  bundle: true,
  outDir: 'dist',
  external: ['esbuild'],
})
