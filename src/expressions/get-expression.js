import createColumn from './column'

export default function createGetExpression(tableIndex) {
    return column => () => createColumn(tableIndex) (column)
}