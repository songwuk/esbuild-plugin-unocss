import path from 'path'
import { createGenerator } from '@unocss/core'
import presetUno from '@unocss/preset-uno'
import type { Plugin } from 'esbuild'
import * as parser from '@babel/parser'
import _traverse from '@babel/traverse'
import _generate from '@babel/generator'
import fs from 'fs-extra'
import { addSideEffect } from '@babel/helper-module-imports'
const generate = (_generate as any).default
const traverse = (_traverse as any).default
interface myOptions {
  alias: string
}
export default (options: myOptions = { alias: 'ts' }): Plugin => ({
  name: 'esbuild-plugin-unocss',
  setup(build) {
    options.alias = options.alias || '.'
    const filter = new RegExp(`${options.alias}`,'i')
    const suffixname = ['.ts']

    build.onResolve({filter}, async(resolve) => {
      console.log(resolve,'resolve')
      if(resolve.kind === 'entry-point')
        return
      if (resolve.namespace === 'unocss-js') {
        return {
          path: path.resolve(path.dirname(resolve.importer),resolve.path),
        }
      }
      if (resolve.resolveDir === '') {
        return // Ignore unresolvable paths
      }
      let namePath = path.isAbsolute(resolve.path)? resolve.path : path.resolve(resolve.resolveDir, resolve.path)
      if(!suffixname.includes(path.extname(namePath))){
        for (const iterator of suffixname) {
          const namePath1 = namePath + iterator
          if(fs.existsSync(namePath1)){
            namePath = namePath1
            break
          }
        }
      }
      return {
        path: namePath,
        namespace: 'unocss-js'
      }
    })
    build.onLoad({ filter: /\.ts$/, namespace: 'unocss-js' }, async (args) => {
      console.log('unocss-js', args)
      const options = presetUno()
      const sourceDir = path.dirname(args.path)
      const generator = createGenerator(options, { /* default options */ })
      const source = await fs.readFile(args.path, 'utf-8')
      const code = parser.parse(source, {
        sourceType: 'unambiguous',
      })
      const state = {
        trackerImportId: '',
      }
      const filename = path.basename(args.path).replace(/\.ts$/, '.css')
      let targets: unknown[] = []
      await traverse(code, {
        Program: {
          enter(path: any) {
            path.traverse({
              ObjectExpression(path: any) {
                for (const iterator of path.node.properties) {
                  if (iterator.type === 'ObjectProperty' && iterator.key.name !== 'name') {
                    targets.push(iterator.key.name)
                    targets = [...new Set(targets)]
                  }
                }
              },
              ImportDeclaration(curPath: any) {
                // if hava import
                const requirePath = curPath.get('source').node.value
                if (requirePath === filename) {
                  const specifierPath = curPath.specifiers[0]
                  if (specifierPath.isImportSpecifier())
                    state.trackerImportId = specifierPath.toString()
                  else if (specifierPath.isImportNamespaceSpecifier())
                    state.trackerImportId = specifierPath.get('local').toString()
                  curPath.stop()
                }
              },
            })
            if (!state.trackerImportId)
              // import 'demo.css'
              state.trackerImportId = addSideEffect(path, filename)
          },
          exit() {
            // first create css file
            generator.generate(targets.join(' ')).then(async (target) => {
              const tmpFilePath = path.resolve(sourceDir, filename)
              const data = new Uint8Array(Buffer.from(`${target.css}`))
              if (!target.css) {
                console.error('Error', 'css is empty')
                return undefined
              }
              await fs.writeFile(tmpFilePath, data, 'utf-8')
              // then add css to code
            })
          },
        },
      })
      const outfile = await generate(code, { sourceMaps: true })
      try {
        return {
          contents: outfile.code,
          // pluginData: outfile.code,
        }
      }
      catch (error) {
        console.error(error)
      }
    })
  },
})
