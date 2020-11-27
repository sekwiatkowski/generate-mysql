import {mapValues} from 'standard-functions'

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

export function createAscendingOrdersFromMapping(tableIndex, mapping) {
    return mapValues(createAscendingOrder(tableIndex)) (mapping)
}

export function createDescendingOrdersFromMapping(tableIndex, mapping) {
    return mapValues(createDescendingOrder(tableIndex)) (mapping)
}