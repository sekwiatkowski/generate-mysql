import {isObject, mapValues} from 'standard-functions'
import createValue from './value'
import {createColumn} from './column'

export function createEquality(left) {
    return right => ({
        left,
        right,
        kind: 'equals'
    })
}

export function createPredicateBuilder(tableIndex) {
    return columnName => {
        const left = createColumn(tableIndex)(columnName)

        return ({
            columnName,
            tableIndex,
            equals: function (other) {
                const right = isObject(other)
                    ? createColumn(other.tableIndex) (other.columnName)
                    : createValue(other)

                return createEquality(left) (right)
            }
        })
    }
}

export function createPredicateBuildersFromMapping(tableIndex, mapping) {
    return mapValues(createPredicateBuilder(tableIndex))(mapping)
}