import angular from 'angular'
import extractExpressionName from './extractPropName'

/**
 * Extract the property/data expressions from the element attribute.
 *
 * @param exprType 'props'|'data'
 * @param attributes Object
 *
 * @returns {Object|string|null}
 */

export function extractExpressions (exprType, attributes) {
  const objectExprKey = 'v' + exprType[0].toUpperCase() + exprType.slice(1)
  const objectPropExprRegExp = new RegExp(objectExprKey, 'i')

  const objectExpr = attributes[objectExprKey]

  if (angular.isDefined(objectExpr)) {
    return objectExpr
  }

  const expressions = Object.keys(attributes)
    .filter((attr) => objectPropExprRegExp.test(attr))

  if (expressions.length === 0) {
    return null
  }

  const exprsMap = {/* name : expression */}
  expressions.forEach((attrExprName) => {
    const exprName = extractExpressionName(attrExprName, objectExprKey)
    exprsMap[exprName] = attributes[attrExprName]
  })

  return exprsMap
}

/**
 * @param attributes Object
 * @returns {{data: (Object|string|null), props: (Object|string|null)}}
 */
export default function getExpressions (attributes) {
  return {
    data: extractExpressions('data', attributes),
    bind: extractExpressions('props', attributes),
    events: extractExpressions('on', attributes)
  }
}
