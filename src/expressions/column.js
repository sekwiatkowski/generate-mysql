import {mapValues} from 'standard-functions'

export function createColumn(tableIndex) {
    return columnName => ({
        tableIndex,
        columnName,
        kind: 'column'
    })
}


export function createColumnsFromMapping(tableIndex, mapping) {
    return mapValues(createColumn(tableIndex))(mapping)
}