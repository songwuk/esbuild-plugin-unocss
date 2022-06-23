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
    const filtercss = /.\.css$/
    const inputfileType = /^\./
    const suffixname = ['.ts', '.tsx', '.js', '.jsx']
    /**
     * checkPath
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
    build.onResolve({ filter: filtercss }, async (resolve) => {
      return {
        path: path.isAbsolute(resolve.path) ? resolve.path : path.resolve(resolve.resolveDir, resolve.path),
        namespace: 'transform-css',
      }
    })
    build.onResolve({ filter: inputfileType }, async (resolve) => {
      let namePath = path.isAbsolute(resolve.path) ? resolve.path : path.resolve(resolve.resolveDir, resolve.path)
      namePath = checkPath(namePath)
      console.log(namePath,'namePath')
      return {
        path: namePath,
        namespace: 'transform-js',
      }
    })
    build.onLoad({ filter: filterjs, namespace: 'transform-js' }, async (args) => {
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
      console.log(transformCode.code,'code')
      const unocss = await generator.applyExtractors(transformCode.code)
      const matchedMy = []
      for (const i of Array.from(unocss)) {
        if (i.endsWith(':') && !i.startsWith('name'))
          matchedMy.push(i.substring(0, i.length - 1))
      }
      const { css, matched } = await generator.generate(matchedMy.join(' '), { preflights: false })
      const tmpFilePath = path.resolve(sourceDir, filename)
      let replaceCss = css
      Array.from(matched).forEach((i) => {
        const reg = new RegExp(i, 'g')
        replaceCss = replaceCss.replace(reg, `${i},[${i}='']`)
      })
      const data = new Uint8Array(Buffer.from(`${replaceCss}`))
      let lineImport = ''
      if (css) {
        await fs.writeFile(tmpFilePath, data, 'utf-8')
        lineImport = `import "./${filename}"`
      }
      // then add css to code
      try {
        return {
          contents: `${lineImport}\n${transformCode.code}`,
          loader: loaderType,
          resolveDir: sourceDir,
        }
      }
      catch (error) {
        console.error('Error', error)
      }
    })

    build.onLoad({ filter: /.*/, namespace: 'transform-css' }, async (args) => {
      const sourceDir = path.dirname(args.path)
      const result = await esbuild.build({
        entryPoints: [args.path],
        bundle: true,
        write: false,
      })
      console.log(result.outputFiles[0].text,'text')
      try {
        return args.path ? {
          resolveDir: sourceDir,
          contents: result.outputFiles[0].text,
          loader: 'file'
        } : null
      }
      catch (error) {
        console.error('Error', error)
      }
    })
  },
})
