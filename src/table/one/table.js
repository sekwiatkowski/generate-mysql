import {generateParameterlessQuery} from '../../generation/generate_query'
import {arrayOf, mapValues} from 'compose-functions'
import {createComparisonExpression} from '../../expressions/comparison-expression'
import {createAscendingExpression, createDescendingExpression} from '../../expressions/sort-expression'
import createJoin from '../../expressions/join'
import {TwoTables} from '../two/two-tables'
import {FilteredTable} from './filtered-table'
import {SortedTable} from './sorted-table'
import createMapExpression from '../../expressions/map-expression'
import createGetExpression from '../../expressions/get-expression'
import {generateInsert} from '../../generation/generate_insert'
import {generateTruncate} from '../../generation/generate_truncate'
import {createQuery} from '../../query'

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
        const filterExpressions = mapValues(createComparisonExpression(0))(this.mapping)

        return new FilteredTable(this.name, this.mapping, f(filterExpressions))
    }

    sortBy(f) {
        const ascendingExpressions = mapValues(createAscendingExpression(0))(this.mapping)

        return new SortedTable(this.name, this.mapping, f(ascendingExpressions))
    }

    sortDescendinglyBy(f) {
        const descendingExpressions = mapValues(createDescendingExpression(0))(this.mapping)

        return new SortedTable(this.name, this.mapping, f(descendingExpressions))
    }

    select() {
        return createQuery(() => this.generateSelectFrom('*'))
    }

    map(f) {
        const mapExpressions = mapValues(createMapExpression(0))(this.mapping)

        return createQuery(() => this.generateSelectFrom(f(mapExpressions)))
    }

    get(f) {
        const getExpressions = mapValues(createGetExpression(0))(this.mapping)

        return createQuery(() => this.generateSelectFrom(f(getExpressions)))
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