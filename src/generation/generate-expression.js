import {generateValue, isNullableValue} from './generate-value'
import generateColumnExpression from './generate-column-expression'

export default function generateExpression(useAlias) {
    return expression => isNullableValue(expression)
        ? generateValue(expression)
        : generateColumnExpression(useAlias) (expression)
}