import createColumn from './column_expressions'

export function createMapExpression(tableIndex) {
    return column => () => createColumn(tableIndex) (column)
}