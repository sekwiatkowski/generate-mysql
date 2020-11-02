import createColumn from './column'

export default function createMapExpression(tableIndex) {
    return column => () => createColumn(tableIndex) (column)
}