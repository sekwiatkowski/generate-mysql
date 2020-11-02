import createColumn from './column-expressions'

export default function createMapExpression(tableIndex) {
    return column => () => createColumn(tableIndex) (column)
}