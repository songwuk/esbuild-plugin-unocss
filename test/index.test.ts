import { describe, expect, it } from 'vitest'
import { createGenerator } from '@unocss/core'
import presetUno from '@unocss/preset-uno'
import { getFile } from '../src/utils'
describe('css', () => {
  it('test class', async () => {
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
    expect(replaceCss).toMatchInlineSnapshot(`
      "/* layer: default */
      .absolute,[absolute=''],
      .after-absolute,[after-absolute='']::after{position:absolute;}
      .after-left-0,[after-left-0='']::after{left:0rem;}
      .m3,[m3='']{margin:0.75rem;}
      .max-w-7xl,[max-w-7xl=''],[w-7xl='']{max-width:80rem;}
      .w-7xl{width:80rem;}
      .after-content-none,[after-content-none='']::after{content:\\"\\";}"
    `)
  })
})
