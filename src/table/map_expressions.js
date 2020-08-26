const {createColumn} = require('./column')

function createMapExpression(tableIndex) {
    return column => createColumn(tableIndex) (column)
}

module.exports = {
    createMapExpression
}