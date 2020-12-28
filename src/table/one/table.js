import {generateQuery} from '../../generation/generate-query'
import {createPredicateBuildersFromMapping} from '../../expressions/predicate'
import {createAscendingOrdersFromMapping, createDescendingOrdersFromMapping} from '../../expressions/order'
import createJoin from '../../expressions/join'
import {TwoTables} from '../two/two-tables'
import {FilteredTable} from './filtered-table'
import {SortedTable} from './sorted-table'
import generateInsert from '../../generation/generate-insert'
import generateTruncate from '../../generation/generate-truncate'
import {createCountQuery, createLimitedQuery, createOffsetQuery, createQuery} from '../../query'
import {createColumnsFromMapping} from '../../expressions/column'
import {generateDelete} from '../../generation/generate-delete'

export class Table {
    name
    mapping
    generateSelectFrom

    constructor(name, mapping) {
        this.name = name
        this.mapping = mapping
        this.generateSelectFrom = select => generateQuery({ select, from: this.name })
    }

    innerJoin(otherTable, f) {
        const firstComparisonExpressions = createPredicateBuildersFromMapping(0, this.mapping)
        const secondComparisonExpressions = createPredicateBuildersFromMapping(1, otherTable.mapping)

        const predicate = f(firstComparisonExpressions, secondComparisonExpressions)
        const join = createJoin(1, otherTable.name, predicate)

        return new TwoTables(this.name, this.mapping, otherTable.name, otherTable.mapping, join)
    }

    filter(f) {
        const predicates = createPredicateBuildersFromMapping(0, this.mapping)
        
        return new FilteredTable(this.name, this.mapping, f(predicates))
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

    map(f) {
        const columns = createColumnsFromMapping(0, this.mapping)

        return createQuery(this.generateSelectFrom(f(columns)))
    }

    get(f) {
        const columns = createColumnsFromMapping(0, this.mapping)

        return createQuery(this.generateSelectFrom(f(columns)))
    }

    count() {
        return createCountQuery(this.generateSelectFrom)
    }

    insert(obj) {
        return this.insertBatch([ obj ])
    }

    insertBatch(objs) {
        return generateInsert(this.name) (this.mapping) (objs)
    }

    deleteAll() {
        return generateDelete(this.name)
    }

    /* TRUNCATE quickly removes all rows from a set of tables.
       It has the same effect as an unqualified DELETE on each table, but since it does not actually scan the tables it is faster.
       Furthermore, it reclaims disk space immediately, rather than requiring a subsequent VACUUM operation. This is most useful on large tables. */
    truncate() {
        return generateTruncate(this.name)
    }
}