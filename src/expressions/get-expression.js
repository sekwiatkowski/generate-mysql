import createColumn from './column_expressions'

export function createGetExpression(tableIndex) {
    return column => () => createColumn(tableIndex) (column)
}