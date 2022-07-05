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
      id: `pane-${paneName.value}`,
      m3: '',
      ...{
        'absolute': '',
        'after-absolute': '',
        'w-7xl': '',
        'max-w-7xl': '',
        'after-content-none': '',
        'after-left-0': '',
      },
    }, [ctx.slots.default ? h(ctx.slots.default) : ''])
  },
})

export type TabPaneInstance = InstanceType<typeof TabPane>

export {
  TabPane,
}
