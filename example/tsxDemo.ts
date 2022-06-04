import { defineComponent, h } from 'vue'
const demo = defineComponent({
  name: 'TsxDemo',
  setup() {
    const a = 1
    return h('div', { ml12: true, ma14: true }, [h('div', { ml15: true, ma4: true }, a)])
  },
})

export {
  demo,
}
