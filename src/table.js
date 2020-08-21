const {generateSql} = require('./generation')
const {mapValues} = require('compose-functions')

function createColumn(table) {
    return column => ({
        table,
        column,
        kind: 'column'
    })
}

function createValue(value, index) {
    return {
        value,
        index,
        kind: 'value'
    }
}

function createEquals(left, right) {
    return {
        left,
        right,
        kind: 'equals'
    }
}

function createColumnPredicate(table, firstParameterIndex) {
    const createTableColumn = createColumn(table)

    return column => ({
        equals: function(value) {
            return createEquals(createTableColumn(column), createValue(value, firstParameterIndex))
        }
    })
}

class Table {
    name
    columns

    constructor(name, columns) {
        this.name = name
        this.columns = columns
    }

    filter(f) {
        const columnsPredicates = mapValues(createColumnPredicate(0, 0))(this.columns)

        return new FilteredTable(this.name, f(columnsPredicates))
    }

    select() {
        return generateSql({ select: '*', from: this.name })
    }
}

class FilteredTable {
    name
    where

    constructor(name, where) {
        this.name = name
        this.where = where
    }

    select() {
        return generateSql({ select: '*', from: this.name, where: this.where })
    }
}

module.exports = {
    Table
}