const {createColumn} = require('./comparison-expressions')

function createMapExpression(tableIndex) {
    return column => () => createColumn(tableIndex) (column)
}

module.exports = {
    createMapExpression
}