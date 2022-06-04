import { defineConfig } from 'tsup'
import esbuildPluginUnocss from '../src/index'
// import esbuildPluginUnocss from '../dist/index'
export default defineConfig({
  entry: ['./index.ts'],
  esbuildPlugins: [esbuildPluginUnocss({
    alias: '.',
  })],
  splitting: false,
  sourcemap: true,
  clean: true,
})
