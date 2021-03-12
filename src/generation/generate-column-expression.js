import generateColumnAccess from './access/generate-column-access'
import {countExpression} from './generate-aggregation'
import {generateIsNotNull, generateIsNull} from './boolean/generate-unary-predicate'
import {
    generateAddition,
    generateDivision,
    generateMultiplication,
    generateSubtraction
} from './numeric/generate-computation'


export default function generateColumnExpression(useAlias) {
    return expression => {
        switch (expression.kind) {
            case 'add':
                return generateAddition(useAlias) (expression)
            case 'subtract':
                return generateSubtraction(expression)
            case 'multiply':
                return generateMultiplication(expression)
            case 'divide':
                return generateDivision(expression)

            case 'column':
                return generateColumnAccess(useAlias) (expression)

            case 'is null':
                return generateIsNull(useAlias) (expression)
            case 'is not null':
                return generateIsNotNull(useAlias) (expression)

            case 'count':
                return countExpression

            default:
                throw Error(`Unsupported kind of column expression: ${expression.kind}`)
        }
    }
}