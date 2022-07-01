/* eslint-disable no-console */
import * as esbuild from 'esbuild'
import fs from 'fs-extra'
import JoyCon from 'joycon'
import esbuildPluginUnocss from '../dist/index.js'
async function buildJs() {
  const joycon = new JoyCon()
  const datafommat = await fs.readFile('./package.json', 'utf8')
  joycon.resolve(['./tsconfig.json']).then((data) => {
    console.log(data, 'sss')
  })
  Array.from(['iife', 'esm', 'cjs']).forEach(async (format) => {
    const pkgType = JSON.parse(datafommat).type && JSON.parse(datafommat).type
    let jsExtension = '.js'
    const isModule = pkgType === 'module'
    if (isModule && format === 'cjs')
      jsExtension = '.cjs'

    if (!isModule && format === 'esm')
      jsExtension = '.mjs'

    if (format === 'iife')
      jsExtension = '.global.js'

    esbuild
      .build({
        entryPoints: ['src/index.ts'],
        bundle: true,
        splitting: false,
        format,
        external: ['vue'],
        plugins: [esbuildPluginUnocss({ alias: 'ts' })],
        outfile: `public/dist/js/index${jsExtension}`,
      })
      .catch(e => console.error(e.message))
  })
}
async function build() {
  await Promise.all([
    buildJs().then(() => {
      console.log('✅ Build JS complete')
    })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((_err) => {
        console.error('💣 Error building JS')
      })])
}

export default build
