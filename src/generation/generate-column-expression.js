import generateColumnAccess from './generate-column-access'
import {generateIsNotNull, generateIsNull} from './generate-predicate'


export default function generateColumnExpression(useAlias) {
    return expression => {
        switch (expression.kind) {
            case 'column':
                return generateColumnAccess(useAlias) (expression)
            case 'is null':
                return generateIsNull(useAlias) (expression)
            case 'is not null':
                return generateIsNotNull(useAlias) (expression)
            default:
                throw Error(`Unsupported column function: ${expression.kind}`)
        }
    }
}