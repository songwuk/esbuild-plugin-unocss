import path from 'path'
import { createGenerator } from '@unocss/core'
import presetUno from '@unocss/preset-uno'
import type { Plugin } from 'esbuild'
import * as parser from '@babel/parser'
import _traverse from '@babel/traverse'
import _generate from '@babel/generator'
import fs from 'fs-extra'
import { addSideEffect } from '@babel/helper-module-imports'
const generate = _generate.default
const traverse = _traverse.default
// import * as ts from 'typescript'
interface myOptions {
  isFileType: 'js' | 'ts' | 'tsx'
}
const state = {
  trackerImportId: '',
}
export default (options: myOptions = { isFileType: 'ts' }): Plugin => ({
  name: 'esbuild-plugin-unocss',
  setup(build) {
    options.isFileType = options.isFileType || 'ts'
    const filter = /demo/
    build.onLoad({ filter }, async (args) => {
      const options = presetUno()
      const sourceDir = path.dirname(args.path)
      const generator = createGenerator(options, { /* default options */ })
      const source = await fs.readFile(args.path, 'utf-8')
      const code = parser.parse(source, {
        sourceType: 'unambiguous',
      })
      const filename = path.basename(args.path).replace(/\.ts$/, '.css')
      let targets: unknown[] = []
      await traverse(code, {
        ObjectExpression(path: any) {
          for (const iterator of path.node.properties) {
            if (iterator.type === 'ObjectProperty' && iterator.key.name !== 'name') {
              targets.push(iterator.key.name)
              targets = [...new Set(targets)]
            }
          }
        },
        Program: {
          enter(path: { traverse: (arg0: { ImportDeclaration(curPath: any): void }) => void }) {
            path.traverse({
              ImportDeclaration(curPath: any) {
                // 有的话就不导入
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
          exit(paths: any) {
            console.log(targets, 'targets3')
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
      console.log(outfile.code, 'outfile.code')
      try {
        return {
          contents: `${outfile.code}//# sourceMappingURL=${outfile.map.toString()}`,
          loader: 'ts',
        }
      }
      catch (error) {
        console.error(error)
      }
    })
  },
})
