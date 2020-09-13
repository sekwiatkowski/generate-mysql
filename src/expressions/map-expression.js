const {createColumn} = require('./comparison-expression')

function createMapExpression(tableIndex) {
    return column => () => createColumn(tableIndex) (column)
}

module.exports = {
    createMapExpression
}