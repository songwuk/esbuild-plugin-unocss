import { defineConfig } from 'tsup'
import esbuildPluginUnocss from '../src/index'
export default defineConfig({
  entry: ['./index.ts'],
  esbuildPlugins: [esbuildPluginUnocss({
    isFileType: 'ts',
  })],
  splitting: false,
  sourcemap: true,
  clean: true,
})
