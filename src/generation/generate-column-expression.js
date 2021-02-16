import generateColumnAccess from './generate-column-access'
import {generateIsNotNull, generateIsNull} from './generate-predicate'
import {countExpression} from './generate-aggregation'


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
                throw Error(`Unsupported column function: ${expression.kind}`)
        }
    }
}