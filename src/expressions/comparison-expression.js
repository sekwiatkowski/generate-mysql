import {isObject} from 'compose-functions'

export function createColumn(tableIndex) {
    return column => ({
        tableIndex,
        column,
        kind: 'column'
    })
}

function createValue(value) {
    return {
        value,
        kind: 'value'
    }
}

function createEquals(left) {
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

                return createEquals(left)(right)
            }
        })
    }
}