import * as esbuild from 'esbuild'
// import fs from 'fs-extra'
import esbuildPluginUnocss from '../dist/index.js'

async function buildJs() {
  // const datafommat = await fs.readFile('./package.json', 'utf8')
  esbuild
    .build({
      entryPoints: ['src/index.ts'],
      bundle: true,
      splitting: false,
      format: 'esm',
      external: ['esbuild', 'vue'],
      plugins: [esbuildPluginUnocss({ alias: 'ts' })],
      outfile: 'public/dist/index.js',
    })
    .catch(e => console.error(e.message))
}

async function buildCss() {
  esbuild
    .build({
      entryPoints: ['src/index.ts'],
      bundle: true,
      splitting: false,
      external: ['esbuild'],
      plugins: [esbuildPluginUnocss({ alias: 'ts' })],
      outfile: 'public/dist/index.css',
    })
    .catch(e => console.error(e.message))
}

// buildCss()
buildJs()
