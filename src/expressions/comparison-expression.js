import {isObject} from 'compose-functions'
import createColumn from './column_expressions'
import createValue from './value_expressions'

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
                    ? createColumn(other.tableIndex)(other.columnName)
                    : createValue(other)

                return createEquality(left)(right)
            }
        })
    }
}