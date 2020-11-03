import {generateParameterlessQuery} from '../../generation/generate-query'
import {arrayOf, mapValues} from 'compose-functions'
import {createComparisonExpression} from '../../expressions/predicate'
import {createAscendingSort, createDescending} from '../../expressions/order'
import createJoin from '../../expressions/join'
import {TwoTables} from '../two/two-tables'
import {FilteredTable} from './filtered-table'
import {SortedTable} from './sorted-table'
import generateInsert from '../../generation/generate-insert'
import generateTruncate from '../../generation/generate-truncate'
import {createQuery} from '../../query'
import {createColumnsFromMapping} from '../../expressions/column'

export class Table {
    name
    mapping
    generateSelectFrom

    constructor(name, mapping) {
        this.name = name
        this.mapping = mapping
        this.generateSelectFrom = select => generateParameterlessQuery({ select, from: this.name })
    }

    innerJoin(otherTable, f) {
        const firstComparisonExpressions = mapValues(createComparisonExpression(0))(this.mapping)
        const secondComparisonExpressions = mapValues(createComparisonExpression(1))(otherTable.mapping)

        const comparison = f(firstComparisonExpressions, secondComparisonExpressions)
        const join = createJoin(1, otherTable.name, comparison)

        return new TwoTables(this.name, this.mapping, otherTable.name, otherTable.mapping, join)
    }

    filter(f) {
        const predicates = mapValues(createComparisonExpression(0))(this.mapping)
        
        return new FilteredTable(this.name, this.mapping, f(predicates))
    }

    sortBy(f) {
        const orders = mapValues(createAscendingSort(0))(this.mapping)

        return new SortedTable(this.name, this.mapping, f(orders))
    }

    sortDescendinglyBy(f) {
        const orders = mapValues(createDescending(0))(this.mapping)

        return new SortedTable(this.name, this.mapping, f(orders))
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

    insert(obj) {
        return generateInsert(this.name) (this.mapping) (arrayOf(obj))
    }

    insertBatch(objs) {
        return generateInsert(this.name) (this.mapping) (objs)
    }

    /* TRUNCATE quickly removes all rows from a set of tables.
       It has the same effect as an unqualified DELETE on each table, but since it does not actually scan the tables it is faster.
       Furthermore, it reclaims disk space immediately, rather than requiring a subsequent VACUUM operation. This is most useful on large tables. */
    truncate() {
        return generateTruncate(this.name)
    }
}