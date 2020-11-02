import {isObject} from 'compose-functions'
import createColumn from './column'
import createValue from './value'

export function createEquality(left) {
    return right => ({
        left,
        right,
        kind: 'equals'
    })
}

export function createComparisonExpression(tableIndex) {
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