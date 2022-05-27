import path from 'path'
import { createGenerator } from '@unocss/core'
import presetUno from '@unocss/preset-uno'
import type { Plugin } from 'esbuild'
import fs from 'fs-extra'
interface myOptions {
  tsx?: Boolean
}

export default (options: myOptions = { tsx: true }): Plugin => ({
  name: 'esbuild-plugin-unocss',
  setup(build) {
    options.tsx = options.tsx ?? true
    build.onResolve({ filter: /\.ts$/ }, async (args) => {
      if (/index.ts$/g.test(args.path))
        return
      if (args.resolveDir === '')
        return // Ignore unresolvable paths
      return {
        path: path.isAbsolute(args.path) ? args.path : path.join(args.resolveDir, args.path),
        namespace: 'unocss-stub',
      }
    })
    build.onLoad({ filter: /\.*/, namespace: 'unocss-stub' }, async (args) => {
      const options = presetUno()
      const sourceDir = path.dirname(args.path)
      const generator = createGenerator(options, { /* default options */ })
      const source = await fs.readFile(args.path, 'utf-8')
      // const esbuildCode = esbuild.transformSync(source, {
      //   jsxFactory: 'preserve',
      //   loader: 'css',
      // })
      const filename = path.basename(args.path).replace(/\.ts$/g, '.css')
      const { css } = await generator.generate(source)
      if (!css)
        return null
      const tmpFilePath = path.resolve(sourceDir, filename)
      const data = new Uint8Array(Buffer.from(`${css}`))
      await fs.writeFile(tmpFilePath, data, 'utf-8')
      return {
        contents: new Uint8Array(Buffer.from(`${css}`)),
        loader: 'css',
      }
    })
  },
})
