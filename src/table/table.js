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

    constructor(name, keysToColumns) {
        this.#name = name
        this.#mapping = keysToColumns

        this.#generateInsertForTable = generateInsert(name) (keysToColumns)
        this.#filterExpressions = mapValues(createFilterExpressions(0) (0))(this.#mapping)
        this.#ascendingExpressions = mapValues(createAscendingExpression(0))(this.#mapping)
        this.#descendingExpressions = mapValues(createDescendingExpression(0))(this.#mapping)

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
        return generateQuery({ select: '*', from: this.#name })
    }

    insert(obj) {
        return this.#generateInsertForTable(arrayOf(obj))
    }

    insertBatch(objs) {
        return this.#generateInsertForTable(objs)
    }
}

module.exports = {
    Table
}