import path from 'path'
import { createGenerator } from '@unocss/core'
import presetUno from '@unocss/preset-uno'
import type { Plugin } from 'esbuild'
import * as esbuild from 'esbuild'
import fs from 'fs-extra'
interface myOptions {
  alias: string
}
export default (options: myOptions = { alias: 'ts' }): Plugin => ({
  name: 'esbuild-plugin-unocss',
  setup(build) {
    options.alias = options.alias || '.'
    const filter = new RegExp(`${options.alias}`, 'i')
    const suffixname = ['.ts', '.css']

    build.onResolve({ filter }, async (resolve) => {
      // eslint-disable-next-line no-console
      console.log(resolve, 'resolve')
      if (resolve.kind === 'entry-point')
        return
      if (resolve.namespace === 'transform-js') {
        return {
          path: path.resolve(path.dirname(resolve.importer), resolve.path),
        }
      }
      if (resolve.resolveDir === '')
        return // Ignore unresolvable paths

      let namePath = path.isAbsolute(resolve.path) ? resolve.path : path.resolve(resolve.resolveDir, resolve.path)
      if (!suffixname.includes(path.extname(namePath))) {
        for (const iterator of suffixname) {
          if (fs.existsSync(namePath + iterator)) {
            namePath = namePath + iterator
            break
          }
        }
      }
      if (namePath.endsWith('.css')) {
        return {
          path: namePath,
          namespace: 'transform-css',
        }
      }
      return {
        path: namePath,
        namespace: 'transform-js',
      }
    })
    build.onLoad({ filter: /\.ts$/, namespace: 'transform-js' }, async (args) => {
      const options = presetUno()
      const sourceDir = path.dirname(args.path)
      const generator = createGenerator(options, { /* default options */ })
      const source = await fs.readFile(args.path, 'utf-8')
      const filename = path.basename(args.path).replace(/\.ts$/, '.css')
      const transformCode = await esbuild.transform(source, {
        loader: 'ts',
        tsconfigRaw: `{
          "compilerOptions": {
            "useDefineForClassFields": false, // 不使用define
            "importsNotUsedAsValues": "remove",// 删除未使用的import
            "preserveValueImports": false, // 不保留import的值
          }
        }`,
      })
      const unocss = await generator.applyExtractors(transformCode.code)
      const matched = []
      for (const i of Array.from(unocss)) {
        if (i.endsWith(':') && !i.startsWith('name'))
          matched.push(i.substring(0, i.length - 1))
      }
      const { css } = await generator.generate(matched.join(' '), { preflights: false })
      const tmpFilePath = path.resolve(sourceDir, filename)
      const data = new Uint8Array(Buffer.from(`${css}`))
      if (!css) {
        console.error('Error', 'css is empty')
        return undefined
      }
      await fs.writeFile(tmpFilePath, data, 'utf-8')
      // then add css to code
      try {
        return {
          contents: `import "${filename}"\n ${transformCode.code}`,
          // pluginData: outfile.code,
        }
      }
      catch (error) {
        console.error(error)
      }
    })

    build.onLoad({ filter: /\.css$/, namespace: 'transform-css' }, async (args) => {
      try {
        return {
          path: args.path,
          contents: await fs.readFile(args.path, 'utf-8'),
        }
      }
      catch (error) {
        console.error('Error', 'css is empty')
      }
    })
  },
})
