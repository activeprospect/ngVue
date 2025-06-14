import angular from 'angular'

/**
 * Extract the property/data expressions from the element attribute.
 *
 * @param exprType 'props'|'data'
 * @param attributes Object
 *
 * @returns {Object|string|null}
 */

export function extractExpressions (exprType, alternate, attributes) {
  const objectExprKey = 'v' + exprType[0].toUpperCase() + exprType.slice(1)
  const objectPropExprRegExp = new RegExp(objectExprKey, 'i')

  const objectExpr = attributes[objectExprKey]

  if (angular.isDefined(objectExpr)) {
    return objectExpr
  }

  const expressions = Object.keys(attributes)
    .filter((attr) => objectPropExprRegExp.test(attr) && attr.indexOf('ng') !== 0)
    .concat(Object.keys(attributes.$attr).filter((key) => attributes.$attr[key].search(alternate) === 0 && attributes.$attr[key].search(/(v-bind|ng-)/) === -1))

  if (expressions.length === 0) {
    return null
  }

  const exprsMap = {/* name : expression */}
  expressions.forEach((attrExprName) => {
    const exprName = attrExprName.replace(new RegExp('^' + exprType), '').replace(alternate, '')
    exprsMap[exprName || attrExprName] = attributes[attrExprName]
  })

  return exprsMap
}

/**
 * @param attributes Object
 * @returns {{data: (Object|string|null), props: (Object|string|null)}}
 */
export default function getExpressions (attributes) {
  return {
    data: extractExpressions('data', /^(?=[^:@])/, attributes),
    bind: extractExpressions('bind', /^:/, attributes),
    events: extractExpressions('on', /^@/, attributes)
  }
}
