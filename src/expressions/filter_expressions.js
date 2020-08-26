const {createColumn} = require('./column')
const {compose} = require('compose-functions')

function createValue(parameterIndex) {
    return value => ({
        parameterIndex,
        value,
        kind: 'value'
    })
}

function createEquals(left) {
    return right => ({
        left,
        right,
        kind: 'equals'
    })
}

function createFilterExpressions(tableIndex) {
    return firstParameterIndex => columnName => {
        const column = createColumn(tableIndex)(columnName)
        const createColumnEquals = createEquals(column)

        const createCurrentValue = createValue(firstParameterIndex)

        return ({
            equals: compose(createCurrentValue, createColumnEquals)
        })
    }
}

module.exports = {
    createFilterExpressions
}