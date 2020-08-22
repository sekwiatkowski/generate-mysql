const {arrayOf} = require('compose-functions')
const {generateInsert} = require('./generation/generate_insert')
const {generateQuery} = require('./generation/generate_query')
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
    generateInsertForTable

    constructor(name, keysToColumns) {
        this.name = name
        this.columns = keysToColumns

        this.generateInsertForTable = generateInsert(name) (keysToColumns)
    }

    filter(f) {
        const columnsPredicates = mapValues(createColumnPredicate(0, 0))(this.columns)

        return new FilteredTable(this.name, f(columnsPredicates))
    }

    select() {
        return generateQuery({ select: '*', from: this.name })
    }

    insert(obj) {
        return this.generateInsertForTable(arrayOf(obj))
    }

    insertBatch(objs) {
        return this.generateInsertForTable(objs)
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
        return generateQuery({ select: '*', from: this.name, where: this.where })
    }
}

module.exports = {
    Table
}
