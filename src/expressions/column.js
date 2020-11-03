import {mapValues} from 'compose-functions'

export function createColumn(tableIndex) {
    return column => ({
        tableIndex,
        column,
        kind: 'column'
    })
}


export function createColumnsFromMapping(tableIndex, mapping) {
    return mapValues(createColumn(tableIndex))(mapping)
}