import {generateSelectStatement} from '../../generation/statements/generate-select-statement'
import {createAscendingOrdersFromColumns, createDescendingOrdersFromColumns} from '../../expressions/order'
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
    columns

    constructor(name, mapping) {
        this.name = name
        this.mapping = mapping
        this.generateSelectFrom = select => generateSelectStatement({ select, from: this.name })
        this.columns = createColumnsFromMapping(0, this.mapping)
    }

    innerJoin(otherTable, f) {
        const otherColumns = createColumnsFromMapping(1, otherTable.mapping)

        const join = createJoin(1, otherTable.name, f(this.columns, otherColumns))

        return new TwoTables(this.name, this.mapping, this.columns, otherTable.mapping, otherColumns, join)
    }

    groupBy(f) {
        return new GroupedTable(this.name, this.columns, f(this.columns))
    }

    filter(f) {
        return new FilteredTable(this.name, this.mapping, this.columns, f(this.columns))
    }

    sortBy(f) {
        const orders = createAscendingOrdersFromColumns(this.columns)

        return new SortedTable(this.name, this.columns, null, f(orders))
    }

    sortDescendinglyBy(f) {
        const orders = createDescendingOrdersFromColumns(this.columns)

        return new SortedTable(this.name, this.columns, null, f(orders))
    }

    select() {
        return createQuery(this.generateSelectFrom('*'))
    }

    #query(f) {
        return createQuery(this.generateSelectFrom(f(this.columns)))
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