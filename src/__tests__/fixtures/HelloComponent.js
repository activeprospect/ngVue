import { h, defineComponent } from 'vue'

export default defineComponent({
  name: 'hello-component',
  props: {
    firstName: String,
    lastName: String
  },
  render () {
    return h('span', `Hello ${this.firstName || ''} ${this.lastName || ''}`);
  }
})
