const {createColumn} = require('./comparison_expressions')

function createMapExpression(tableIndex) {
    return column => createColumn(tableIndex) (column)
}

module.exports = {
    createMapExpression
}