import { defineComponent, h  } from 'vue'
import type { VNode,DefineComponent } from 'vue'
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
