import * as esbuild from 'esbuild'
import fs from 'fs-extra'
import esbuildPluginUnocss from '../dist/index.js'
async function buildJs() {
  const data = await fs.readFile('./package.json', 'utf8')
  Array.from(['iife', 'esm', 'cjs']).forEach(async (format) => {
    const pkgType = JSON.parse(data).type && JSON.parse(data).type
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
        entryPoints: ['index.js'],
        bundle: true,
        splitting: false,
        format,
        plugins: [esbuildPluginUnocss({ alias: 'ts' })],
        outfile: `public/dist/js/index${jsExtension}`,
      })
      .catch(e => console.error(e.message))
  })
}
async function buildCss() {
  esbuild
  .build({
    entryPoints: ['in.css'],
    bundle: true,
    sourcemap: true,
    splitting: false,
    plugins: [esbuildPluginUnocss({ alias: 'ts' })],
    outfile: `public/dist/css/index.css`,
  })
  .catch(e => console.error(e.message))
}
buildJs().then(async ()=>{
 await buildCss()
 console.log('打包完成')
})

