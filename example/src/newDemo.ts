import { defineComponent, h, ref } from 'vue'
const TabPane = defineComponent({
  name: 'WlTabPane',
  props: {
    label: {
      type: String,
      default: '',
    },
    name: {
      type: String || Number,
      default: '',
    },
  },
  setup(props, ctx) {
    const paneName = ref('ssss')
    return () => h('div', {
      style: {
        display: 'block',
      },
      id: `pane-${paneName.value}`,
      m3: '',
    }, [ctx.slots.default ? h(ctx.slots.default) : ''])
  },
})

export type TabPaneInstance = InstanceType<typeof TabPane>

export {
  TabPane,
}
