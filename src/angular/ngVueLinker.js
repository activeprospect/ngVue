import Vue from 'vue'
import getVueComponent from '../components/getVueComponent'
import getPropExprs from '../components/props/getExpressions'
import watchPropExprs from '../components/props/watchExpressions'
import evalPropValues from '../components/props/evaluateValues'
import evaluateDirectives from '../directives/evaluateDirectives'

export function ngVueLinker (componentName, jqElement, elAttributes, scope, $injector) {
  const $ngVue = $injector.has('$ngVue') ? $injector.get('$ngVue') : null
  const $interpolate = $injector.get('$interpolate');

  const config = ($ngVue || {}).config || {};
  const dataExprsMap = getPropExprs(elAttributes)
  const Component = getVueComponent(componentName, $injector)
  const directives = evaluateDirectives(elAttributes, scope) || []
  const reactiveData = { _v: evalPropValues(dataExprsMap, scope, ['bind']) || {} }
  const normalData = { _v: evalPropValues(dataExprsMap, scope, ['data']) || {} }

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

  const allData = Object.assign(reactiveData._v, normalData._v );
  const html = $interpolate(jqElement[0].innerHTML)(scope);

  const vueInstance = new Vue(Object.assign({}, vueHooks, config, {
    el: jqElement[0],
    data: reactiveData,
    render (h) {
      return <Component {...{ directives, props: allData, on }}>
      { html ? <span domPropsInnerHTML={ html }/> : '' }</Component>
    },
  }))

  scope.$on('$destroy', () => {
    vueInstance.$destroy()
    if (vueInstance.$el.parentNode) {
      vueInstance.$el.parentNode.removeChild(vueInstance.$el)
    }
  })
}
