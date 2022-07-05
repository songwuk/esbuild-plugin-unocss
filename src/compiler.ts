import { createGenerator } from '@unocss/core'
import presetUno from '@unocss/preset-uno'
import { getFile } from './utils'
/**
 * unocss compiler
 */
export async function compiler() {
  const options = presetUno()
  const generator = createGenerator(options, { /* default options */ })
  const code = await getFile('../example/src/newDemo.ts') as any
  const unocss = await generator.applyExtractors(code)
  const listStyle = Array.from(unocss).map((item) => {
    return item.endsWith(':') ? item.substring(0, item.length - 1) : `${item}`
  }).filter(item => !/,|\{|\)$/.test(item))
  const REStyle = await generator.generate(listStyle.join(' '), { preflights: false })
  let replaceCss = REStyle.css
  Array.from(REStyle.matched).forEach((i) => {
    const reg = new RegExp(i, 'i')
    replaceCss = replaceCss.replace(reg, `${i},[${i}='']`)
  })
}
