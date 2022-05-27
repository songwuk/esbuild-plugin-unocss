import { defineConfig } from 'tsup'
import esbuildPluginUnocss from './src/index'
export default defineConfig({
  entry: ['src/index.ts'],
  esbuildPlugins: [esbuildPluginUnocss()],
  splitting: false,
  sourcemap: true,
  clean: true,
})
