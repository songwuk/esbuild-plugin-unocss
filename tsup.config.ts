import { defineConfig } from 'tsup'
export default defineConfig({
  entry: ['src/index.ts'],
  splitting: true,
  loader: {
    '.ts': 'ts',
  },
  format: ['cjs', 'esm', 'iife'],
  external:[],
  sourcemap: true,
  clean: true,
})
