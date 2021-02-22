import generateColumnAccess from './access/generate-column-access'
import {countExpression} from './generate-aggregation'
import {generateIsNotNull, generateIsNull} from './boolean/generate-unary-predicate'


export default function generateColumnExpression(useAlias) {
    return expression => {
        switch (expression.kind) {
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