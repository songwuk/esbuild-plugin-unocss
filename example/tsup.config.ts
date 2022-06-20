import { defineConfig } from 'tsup'
import esbuildPluginUnocss from '../src/index'
// import esbuildPluginUnocss from '../dist/index'
export default defineConfig({
  entry: ['./src/index.ts'],
  esbuildPlugins: [esbuildPluginUnocss({
    alias: 'ts',
  })],
  splitting: false,
  sourcemap: true,
  clean: true,
})
