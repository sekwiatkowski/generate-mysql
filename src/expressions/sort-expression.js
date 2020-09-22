function createSortExpression(direction) {
    return tableIndex => column => ({
        tableIndex,
        direction,
        column,
        kind: 'sort-expression'
    })
}

export const createAscendingExpression = createSortExpression('ASC')
export const createDescendingExpression = createSortExpression('DESC')