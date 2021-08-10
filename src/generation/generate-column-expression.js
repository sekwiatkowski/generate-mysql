import generateColumnAccess from './access/generate-column-access'
import {countExpression} from './generate-aggregation'
import {generateIsNotNull, generateIsNull} from './boolean/generate-unary-predicate'
import {
    generateAddition,
    generateDivision,
    generateMultiplication,
    generateSubtraction
} from './numeric/generate-computation'
import generateIf from './condition/generate-if'
import {generateValue, isNullableValue} from './generate-value'


export default function generateColumnExpression(useTableAlias) {
    return expression => {
        if (isNullableValue(expression)) {
            return generateValue(expression)
        }

        switch (expression.kind) {
            case 'add':
                return generateAddition(useTableAlias) (expression)
            case 'subtract':
                return generateSubtraction(useTableAlias) (expression)
            case 'multiply':
                return generateMultiplication(useTableAlias) (expression)
            case 'divide':
                return generateDivision(useTableAlias) (expression)

            case 'column':
                return generateColumnAccess(useTableAlias) (expression)

            case 'is null':
                return generateIsNull(useTableAlias) (expression)
            case 'is not null':
                return generateIsNotNull(useTableAlias) (expression)

            case 'if':
                return generateIf(useTableAlias) (expression)

            case 'count':
                return countExpression

            default:
                throw Error(`Unsupported kind of column expression: ${expression.kind}`)
        }
    }
}