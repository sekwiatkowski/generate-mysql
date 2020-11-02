import createColumn from './column-expressions'

export default function createGetExpression(tableIndex) {
    return column => () => createColumn(tableIndex) (column)
}