import { defineComponent, h } from 'vue'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { DefineComponent, VNode } from 'vue'
import './demo1.css'
const demo = defineComponent({
  name: 'Demo',
  setup() {
    const a = 2
    return h('div', { m4: true }, a)
  },
}) as DefineComponent

export {
  demo,
}
