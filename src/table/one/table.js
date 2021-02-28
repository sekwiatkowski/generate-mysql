import {generateSelectStatement} from '../../generation/statements/generate-select-statement'
import {createAscendingOrdersFromMapping, createDescendingOrdersFromMapping} from '../../expressions/order'
import createJoin from '../../expressions/join'
import {TwoTables} from '../two/two-tables'
import {FilteredTable} from './filtered-table'
import {SortedTable} from './sorted-table'
import generateTruncateStatement from '../../generation/statements/generate-truncate-statement'
import {createCountQuery, createQuery} from '../../query'
import {createColumnsFromMapping} from '../../expressions/column'
import {generateDeleteStatement} from '../../generation/statements/generate-delete-statement'
import {generateInsert, generateReplace} from '../../generation/statements/generate-store-statements'
import {GroupedTable} from './grouped-table'

export class Table {
    name
    mapping
    generateSelectFrom

    constructor(name, mapping) {
        this.name = name
        this.mapping = mapping
        this.generateSelectFrom = select => generateSelectStatement({ select, from: this.name })
    }

    innerJoin(otherTable, f) {
        const predicate = f(
            this.#createColumns(),
            createColumnsFromMapping(1, otherTable.mapping))

        const join = createJoin(1, otherTable.name, predicate)

        return new TwoTables(this.name, this.mapping, otherTable.name, otherTable.mapping, join)
    }

    groupBy(f) {
        const columns = this.#createColumns()

        return new GroupedTable(this.name, this.mapping, f(columns))
    }

    filter(f) {
        const columns = this.#createColumns()
        
        return new FilteredTable(this.name, this.mapping, f(columns))
    }

    sortBy(f) {
        const orders = createAscendingOrdersFromMapping(0, this.mapping)

        return new SortedTable(this.name, this.mapping, null, f(orders))
    }

    sortDescendinglyBy(f) {
        const orders = createDescendingOrdersFromMapping(0, this.mapping)

        return new SortedTable(this.name, this.mapping, null, f(orders))
    }

    select() {
        return createQuery(this.generateSelectFrom('*'))
    }

    #createColumns() {
        return createColumnsFromMapping(0, this.mapping)
    }

    #query(f) {
        const columns = this.#createColumns()

        return createQuery(this.generateSelectFrom(f(columns)))
    }

    map(f) {
        return this.#query(f)
    }

    get(f) {
        return this.#query(f)
    }

    count() {
        return createCountQuery(this.generateSelectFrom)
    }

    insert(obj) {
        return this.insertBatch([ obj ])
    }

    replace(obj) {
        return this.replaceBatch([ obj ])
    }

    insertBatch(objs) {
        return generateInsert(this.name) (this.mapping) (objs)
    }

    replaceBatch(objs) {
        return generateReplace(this.name) (this.mapping) (objs)
    }

    deleteAll() {
        return generateDeleteStatement(this.name)
    }

    /* TRUNCATE quickly removes all rows from a set of tables.
       It has the same effect as an unqualified DELETE on each table, but since it does not actually scan the tables it is faster.
       Furthermore, it reclaims disk space immediately, rather than requiring a subsequent VACUUM operation. This is most useful on large tables. */
    truncate() {
        return generateTruncateStatement(this.name)
    }
}