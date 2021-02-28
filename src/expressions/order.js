import {mapValues} from 'standard-functions'

function createOrder(direction) {
    return column => ({
        expression: column,
        direction,
        kind: 'sort-expression'
    })
}

function createOrders(direction) {
    return columns => mapValues(createOrder(direction)) (columns)
}

export const createAscendingOrdersFromColumns = createOrders('ASC')
export const createDescendingOrdersFromColumns = createOrders('DESC')