import { h, reactive, createApp } from 'vue'
import getVueComponent from '../components/getVueComponent'
import getPropExprs from '../components/props/getExpressions'
import watchPropExprs from '../components/props/watchExpressions'
import evalPropValues from '../components/props/evaluateValues'
import evaluateDirectives from '../directives/evaluateDirectives'

export function ngVueLinker (componentName, jqElement, elAttributes, scope, $injector) {
  const $ngVue = $injector.has('$ngVue') ? $injector.get('$ngVue') : null
  const $interpolate = $injector.get('$interpolate')

  const config = ($ngVue || {}).config || {}
  const dataExprsMap = getPropExprs(elAttributes)
  const Component = getVueComponent(componentName, $injector)
  const directives = evaluateDirectives(elAttributes, scope) || []
  let reactiveData = reactive(evalPropValues(dataExprsMap, scope, ['bind']) || {})
  const normalData = evalPropValues(dataExprsMap, scope, ['data']) || {}

  const inQuirkMode = $ngVue ? $ngVue.inQuirkMode() : false
  const vueHooks = $ngVue ? $ngVue.getVueHooks() : {}

  const watchOptions = {
    depth: elAttributes.watchDepth,
    quirk: inQuirkMode
  }


  watchPropExprs(dataExprsMap, reactiveData, watchOptions, scope)

  const on = {}
  if (dataExprsMap.events && Object.keys(dataExprsMap.events).length) {
    Object.keys(dataExprsMap.events).forEach(e => {
      on[e] = scope.$eval(dataExprsMap.events[e])
    })
  }

  const html = $interpolate(jqElement[0].innerHTML)(scope)

  const mountReplace = (component, props, target) => {
    const fragment = document.createDocumentFragment();
    const app = createApp(component, props);
    app.mount(fragment);
    target.parentNode.replaceChild(fragment, target);
    return app;
  }

  Object.assign(reactiveData, normalData, directives, on);

  const vueInstance = mountReplace(Object.assign({}, vueHooks, config, {
    render () {
      return h(Component, reactiveData);
    }
  }), {}, jqElement[0]);

  scope.$on('$destroy', () => {
    vueInstance.unmount();
  })
}
