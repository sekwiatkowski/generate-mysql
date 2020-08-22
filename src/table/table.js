const {generateParameterlessQuery} = require('../generation/generate_query')
const {generateTruncate} = require('../generation/generate_truncate')
const {SortedTable} = require('./sorted_table')
const {generateQuery} = require('../generation/generate_query')
const {generateInsert} = require('../generation/generate_insert')
const {createDescendingExpression} = require('./sort_expressions')
const {createAscendingExpression} = require('./sort_expressions')
const {createFilterExpressions} = require('./filter_expressions')
const {createSortCriterion} = require('./sort_expressions')
const {FilteredTable} = require('./filtered_table')
const {arrayOf} = require('compose-functions')
const {mapValues} = require('compose-functions')

class Table {
    #name
    #mapping
    #generateInsertForTable
    #filterExpressions
    #ascendingExpressions
    #descendingExpressions
    #truncateSql

    constructor(name, keysToColumns) {
        this.#name = name
        this.#mapping = keysToColumns

        this.#generateInsertForTable = generateInsert(name) (keysToColumns)
        this.#filterExpressions = mapValues(createFilterExpressions(0) (0))(this.#mapping)
        this.#ascendingExpressions = mapValues(createAscendingExpression(0))(this.#mapping)
        this.#descendingExpressions = mapValues(createDescendingExpression(0))(this.#mapping)
        this.#truncateSql = generateTruncate(name)

    }

    filter(f) {
        return new FilteredTable(this.#name, f(this.#filterExpressions))
    }

    sortBy(f) {
        return new SortedTable(this.#name, f(this.#ascendingExpressions))
    }

    sortDescendinglyBy(f) {
        return new SortedTable(this.#name, f(this.#descendingExpressions))
    }

    select() {
        return generateParameterlessQuery({ select: '*', from: this.#name })
    }

    insert(obj) {
        return this.#generateInsertForTable(arrayOf(obj))
    }

    insertBatch(objs) {
        return this.#generateInsertForTable(objs)
    }

    /* TRUNCATE quickly removes all rows from a set of tables.
       It has the same effect as an unqualified DELETE on each table, but since it does not actually scan the tables it is faster.
       Furthermore, it reclaims disk space immediately, rather than requiring a subsequent VACUUM operation. This is most useful on large tables. */
    truncate() {
        return this.#truncateSql
    }
}

module.exports = {
    Table
}