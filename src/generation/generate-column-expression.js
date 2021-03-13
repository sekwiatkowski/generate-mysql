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


export default function generateColumnExpression(useAlias) {
    return expression => {
        switch (expression.kind) {
            case 'add':
                return generateAddition(useAlias) (expression)
            case 'subtract':
                return generateSubtraction(useAlias) (expression)
            case 'multiply':
                return generateMultiplication(useAlias) (expression)
            case 'divide':
                return generateDivision(useAlias) (expression)

            case 'column':
                return generateColumnAccess(useAlias) (expression)

            case 'is null':
                return generateIsNull(useAlias) (expression)
            case 'is not null':
                return generateIsNotNull(useAlias) (expression)

            case 'if':
                return generateIf(useAlias) (expression)

            case 'count':
                return countExpression

            default:
                throw Error(`Unsupported kind of column expression: ${expression.kind}`)
        }
    }
}