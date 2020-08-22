function createSortExpression(direction) {
    return tableIndex => column => ({
        tableIndex,
        direction,
        column,
        kind: 'sort-expression'
    })
}


const createAscendingExpression = createSortExpression('ASC')
const createDescendingExpression = createSortExpression('DESC')

module.exports = {
    createAscendingExpression,
    createDescendingExpression
}