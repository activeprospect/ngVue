import angular from 'angular'

/**
 * @param dataExprsMap Object
 * @param dataExprsMap.data Object|string|null
 * @param dataExprsMap.props Object|string|null
 * @param scope Object
 * @returns {string|Object|null}
 */
export default function evaluateValues (dataExprsMap, scope, types = ['bind', 'data']) {
  const evaluatedValues = {}
  for(let i = 0; i < types.length; i++) {
    const type = types[i];
    const expr = dataExprsMap[type]

    if (!expr) {
      return null
    }

    if (angular.isString(expr)) {
      return type === 'bind' ? scope.$eval(expr) : expr
    }

    Object.keys(expr).forEach((key) => {
      evaluatedValues[key] = type === 'bind' ? scope.$eval(expr[key]) : expr[key]
    })
  }

  return evaluatedValues
}
