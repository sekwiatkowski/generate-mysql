import {generateSelectStatement} from '../../generation/statements/generate-select-statement'
import {createQuery} from '../../query'
import {createColumnsFromMapping} from '../../expressions/column'
import {FilteredGroupedTable} from './filtered-grouped-table'

export class GroupedTable {
    name
    mapping
    groupBy
    generateSelectFromGroupBy

    constructor(name, mapping, groupBy) {
        this.name = name
        this.mapping = mapping
        this.groupBy = groupBy
        this.generateSelectFromGroupBy = select => generateSelectStatement({ select, from: this.name, groupBy: this.groupBy })
    }

    #createColumns() {
        return createColumnsFromMapping(0, this.mapping)
    }

    filter(f) {
        const columns = this.#createColumns()

        return new FilteredGroupedTable(this.name, this.mapping, this.groupBy, f(columns))
    }

    #query(f) {
        const columns = this.#createColumns()

        return createQuery(this.generateSelectFromGroupBy(f(columns)))
    }

    map(f) {
        return this.#query(f)
    }

    get(f) {
        return this.#query(f)
    }
}