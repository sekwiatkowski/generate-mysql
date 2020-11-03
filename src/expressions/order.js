function createSort(direction) {
    return tableIndex => column => ({
        tableIndex,
        direction,
        column,
        kind: 'sort-expression'
    })
}

export const createAscendingSort = createSort('ASC')
export const createDescending = createSort('DESC')