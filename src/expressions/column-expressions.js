export default function createColumn(tableIndex) {
    return column => ({
        tableIndex,
        column,
        kind: 'column'
    })
}

