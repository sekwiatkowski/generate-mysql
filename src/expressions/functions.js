import {createColumn} from './column'

export function isNull({ tableIndex, column }) {
    return {
        column: createColumn(tableIndex) (column),
        kind: 'isnull'
    }
}