import { defineComponent, h } from 'vue'

const WlDemo1 = defineComponent({
  name: 'WlDemo1',
  setup() {
    return h('div', { ml41: true }, 'step')
  },
})

export {
  WlDemo1,
}
