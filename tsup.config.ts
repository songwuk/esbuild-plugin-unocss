import { defineConfig } from 'tsup'
export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  loader: {
    '.ts': 'ts',
  },
  format: ['cjs', 'esm', 'iife'],
  external: ['vue'],
  sourcemap: true,
  clean: true,
})
