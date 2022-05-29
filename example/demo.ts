import { defineComponent, h } from 'vue'
const demo = defineComponent({
  name: 'Demo',
  setup() {
    const a = 1
    return h('div', { ml14: true, ma4: true }, [h('div', { ml4: true, ma4: true }, a)])
  },
})

export {
  demo,
}
