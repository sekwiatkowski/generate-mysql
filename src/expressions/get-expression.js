const {createColumn} = require('./comparison-expression')

function createGetExpression(tableIndex) {
    return column => () => createColumn(tableIndex) (column)
}

module.exports = {
    createGetExpression
}