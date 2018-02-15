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
  types.forEach( key => {
    const expr = dataExprsMap[key]

    if (!expr) {
      return null
    }

    if (angular.isString(expr)) {
      return key == 'bind' ? scope.$eval(expr) : expr;
    }

    Object.keys(expr).forEach((key) => {
      evaluatedValues[key] = key == 'bind' ? scope.$eval(expr[key]) : expr[key];
    })
  });

  return evaluatedValues
}
