import { defineComponent, h } from 'vue'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { DefineComponent, VNode } from 'vue'
import './demo1.css'
const demo = defineComponent({
  name: 'Demo',
  setup() {
    const a = 2
    return h('div', { ml142: true, ma4: true }, [h('div', { ml45: true, ma4: true }, a)])
  },
}) as DefineComponent

export {
  demo,
}
