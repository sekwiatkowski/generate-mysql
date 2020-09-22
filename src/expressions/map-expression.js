import {createColumn} from './comparison-expression'

export function createMapExpression(tableIndex) {
    return column => () => createColumn(tableIndex) (column)
}