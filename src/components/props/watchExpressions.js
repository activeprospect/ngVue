import {isString, isArray, isObject} from 'angular'

function watch (expressions, reactiveData) {
  return (watchFunc) => {
    // for `vprops` / `vdata`
    if (isString(expressions)) {
      watchFunc(expressions, v => Object.keys(v).forEach(k => reactiveData[k] = v[k]))
      return
    }

    // for `vprops-something`
    Object.keys(expressions)
      .forEach((name) => {
        watchFunc(expressions[name], v => reactiveData[name] = v)
      })
  }
}

/**
 * @param setter Function a reactive setter from VueJS
 * @param inQuirkMode boolean a quirk mode will fix the change detection issue
 *                            caused by the limitation of the reactivity system
 * @returns Function a watch callback when the expression value is changed
 */
function notify (setter, inQuirkMode) {
  return function (newVal) {
    let value = newVal

    if (inQuirkMode) {
      // `Vue.set` uses a shallow comparision to detect the change in the setters, and so
      // for an object and an array, we have to create a new one to force the reactivity
      // system to walk through all the properties to detect the change and to convert the
      // new values into a reactive data.
      value = isArray(newVal) ? [...newVal] : (isObject(newVal) ? {...newVal} : newVal)
    }

    setter(value)
  }
}

/**
 *
 * @param dataExprsMap Object
 * @param dataExprsMap.data Object|string|null
 * @param dataExprsMap.props Object|string|null
 * @param reactiveData Object
 * @param reactiveData._v Object
 * @param options Object
 * @param options.depth 'reference'|'value'|'collection'
 * @param options.quirk 'reference'|'value'|'collection'
 * @param scope Object
 */
export default function watchExpressions (dataExprsMap, reactiveData, options, scope) {
  const expressions = dataExprsMap.bind ? dataExprsMap.bind : dataExprsMap.data

  if (!expressions) {
    return
  }

  const { depth, quirk } = options
  const watcher = watch(expressions, reactiveData)

  switch (depth) {
    case 'value':
      watcher((expression, setter) => {
        scope.$watch(expression, notify(setter, quirk), true)
      })
      break
    case 'collection':
      watcher((expression, setter) => {
        scope.$watchCollection(expression, notify(setter, quirk))
      })
      break
    case 'reference':
    default:
      watcher((expression, setter) => {
        scope.$watch(expression, notify(setter, quirk))
      })
  }
}
