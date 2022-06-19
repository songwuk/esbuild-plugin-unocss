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
    // eslint-disable-next-line no-console
    console.log(options.alias)
    const filterjs = /\.[jt](sx|s)?$/
    const filtercss = /\.css$/
    const suffixname = ['.ts', '.tsx', '.js', '.jsx', '.css']
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
    build.onResolve({ filter: filterjs }, async (resolve) => {
      if (resolve.resolveDir === '')
        return // Ignore unresolvable paths

      let namePath = path.isAbsolute(resolve.path) ? resolve.path : path.resolve(resolve.resolveDir, resolve.path)
      namePath = checkPath(namePath)
      return {
        path: namePath,
        namespace: 'transform-js',
      }
    })
    build.onResolve({ filter: filtercss }, async (resolve) => {
      const pathName = path.resolve(path.dirname(resolve.importer), resolve.path)
      if (pathName.endsWith('.css')) {
        return {
          path: pathName,
          namespace: 'transform-css',
        }
      }
      return {
        path: checkPath(pathName),
        namespace: 'transform-css',
      }
    })
    build.onLoad({ filter: /.*/, namespace: 'transform-js' }, async (args) => {
      const options = presetUno()
      const sourceDir = path.dirname(args.path)
      const generator = createGenerator(options, { /* default options */ })
      const source = await fs.readFile(args.path, 'utf-8')
      const fileSuffix = path.extname(args.path)
      let loaderType = 'ts' as esbuild.Loader
      if (fileSuffix.endsWith('.js'))
        loaderType = 'js'
      else if (fileSuffix.endsWith('.jsx'))
        loaderType = 'jsx'
      else if (fileSuffix.endsWith('.ts'))
        loaderType = 'ts'
      else if (fileSuffix.endsWith('.tsx'))
        loaderType = 'tsx'
      const regSuffix = new RegExp(`${fileSuffix}$`, 'ig')
      const filename = path.basename(args.path).replace(regSuffix, '.css')
      const transformCode = await esbuild.transform(source, {
        loader: loaderType,
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
      let replaceCss = css
      matched.forEach((i) => {
        const reg = new RegExp(i, 'g')
        replaceCss = replaceCss.replace(reg, `${i},[${i}='']`)
      })
      const data = new Uint8Array(Buffer.from(`${replaceCss}`))
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

    build.onLoad({ filter: /.*/, namespace: 'transform-css' }, async (args) => {
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
