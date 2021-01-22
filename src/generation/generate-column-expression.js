import generateColumnAccess from './generate-column-access'
import {generateIsNotNull, generateIsNull} from './generate-predicate'


export default function generateColumnExpression(expression) {
    switch (expression.kind) {
        case 'column':
            return generateColumnAccess(expression)
        case 'is null':
            return generateIsNull(expression)
        case 'is not null':
            return generateIsNotNull(expression)
        default:
            throw Error(`Unsupported column function: ${expression.kind}`)
    }
}