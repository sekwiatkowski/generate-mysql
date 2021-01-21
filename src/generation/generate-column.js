import {generateTableAlias} from './generate-table'

export default function generateColumn(expression) {
    switch (expression.kind) {
        case 'column':
            const {tableIndex, column} = expression
            return `${generateTableAlias(tableIndex)}.${column}`
        case 'isnull':
            return `ISNULL(${generateColumn(expression.column)})`
        default:
            throw Error(`Unsupported column function: ${expression.kind}`)
    }
}