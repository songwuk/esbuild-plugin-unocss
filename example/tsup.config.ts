import { defineConfig } from 'tsup'
import esbuildPluginUnocss from '../src/index'
export default defineConfig({
  entry: ['./src/index.ts'],
  esbuildPlugins: [esbuildPluginUnocss({
    alias: 'ts',
  })],
  splitting: false,
  format: ['cjs', 'esm'],
  sourcemap: true,
  clean: true,
})
