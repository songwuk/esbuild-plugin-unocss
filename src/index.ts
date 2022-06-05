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
    /**
     * check
     */
    const checkPath = (pathName: string) => {
      if (!suffixname.includes(path.extname(pathName))) {
        for (const iterator of suffixname) {
          if (fs.existsSync(pathName + iterator)) {
            pathName = pathName + iterator
            break
          }
        }
      }
      return pathName
    }
    build.onResolve({ filter }, async (resolve) => {
      if (resolve.kind === 'entry-point')
        return
      if (resolve.namespace === 'transform-js') {
        const pathName = path.resolve(path.dirname(resolve.importer), resolve.path)
        // console.log(checkPath(pathName), 'pathName')
        if (pathName.endsWith('.css')) {
          return {
            path: pathName,
            namespace: 'transform-css',
          }
        }
        return {
          path: checkPath(pathName),
          namespace: 'transform-js',
        }
      }
      if (resolve.resolveDir === '')
        return // Ignore unresolvable paths

      let namePath = path.isAbsolute(resolve.path) ? resolve.path : path.resolve(resolve.resolveDir, resolve.path)
      namePath = checkPath(namePath)
      if (namePath.endsWith('.css')) {
        return {
          path: namePath,
          namespace: 'transform-css',
        }
      }
      // console.log(namePath)
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
      let lineImport = ''
      if (css) {
        await fs.writeFile(tmpFilePath, data, 'utf-8')
        lineImport = `import "${filename}"`
      }
      // then add css to code
      try {
        return {
          contents: `${lineImport}\n${transformCode.code}`,
        }
      }
      catch (error) {
        console.error('Error', error)
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
        console.error('Error', error)
      }
    })
  },
})
