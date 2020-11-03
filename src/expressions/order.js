function createOrder(direction) {
    return tableIndex => column => ({
        tableIndex,
        direction,
        column,
        kind: 'sort-expression'
    })
}

export const createAscendingOrder = createOrder('ASC')
export const createDescendingOrder = createOrder('DESC')
