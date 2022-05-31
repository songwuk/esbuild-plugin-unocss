import { defineComponent, h } from 'vue'
import './demo1.css'
const demo = defineComponent({
  name: 'Demo',
  setup() {
    const a = 1
    return h('div', { ml142: true, ma4: true }, [h('div', { ml45: true, ma4: true }, a)])
  },
})

export {
  demo,
}
