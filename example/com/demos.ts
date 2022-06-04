import { defineComponent, h } from 'vue'

const WlDemo = defineComponent({
  name: 'WlDemo',
  setup() {
    return h('div', { ml41: true }, 'step')
  },
})

export {
  WlDemo,
}
