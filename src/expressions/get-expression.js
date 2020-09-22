import {createColumn} from './comparison-expression'

export function createGetExpression(tableIndex) {
    return column => () => createColumn(tableIndex) (column)
}