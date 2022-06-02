import { defineConfig } from 'tsup'
export default defineConfig({
  entry: ['src/index.ts'],
  splitting: true,
  loader: {
    '.ts': 'ts',
  },
  format: ['cjs', 'esm'],
  sourcemap: false,
  clean: true,
  bundle: true,
  outDir: 'dist',
})
