import { h, defineComponent } from 'vue'

export default defineComponent({
  name: 'persons-component',
  props: {
    persons: {
      type: Array,
      default: () => []
    }
  },
  render (c) {
    return h('ul',
      this.persons.map(p => {
        return h('li', `${p.firstName} ${p.lastName}`);
      })
    )
  }
})
