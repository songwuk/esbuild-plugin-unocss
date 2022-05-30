import { defineComponent, h } from 'vue'
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
