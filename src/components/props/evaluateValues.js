import angular from 'angular'

/**
 * @param dataExprsMap Object
 * @param dataExprsMap.data Object|string|null
 * @param dataExprsMap.props Object|string|null
 * @param scope Object
 * @returns {string|Object|null}
 */
export default function evaluateValues (dataExprsMap, scope) {
  const key = dataExprsMap.bind ? 'bind' : 'data'
  const expr = dataExprsMap[key]

  if (!expr) {
    return null
  }

  if (angular.isString(expr)) {
    return scope.$eval(expr)
  }

  const evaluatedValues = {}
  Object.keys(expr).forEach((key) => {
    evaluatedValues[key] = scope.$eval(expr[key])
  })

  return evaluatedValues
}
