function createColumn(tableIndex) {
    return column => ({
        tableIndex,
        column,
        kind: 'column'
    })
}

module.exports = {
    createColumn
}