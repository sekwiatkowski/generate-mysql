import generateColumnAccess from './generate-column-access'
import {generateIsNull} from './generate-function-invocation'


export default function generateColumnExpression(expression) {
    switch (expression.kind) {
        case 'column':
            return generateColumnAccess(expression)
        case 'isnull':
            return generateIsNull(expression)
        default:
            throw Error(`Unsupported column function: ${expression.kind}`)
    }
}