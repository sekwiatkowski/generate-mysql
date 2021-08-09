import {createQuery} from '../../query'
import {FilteredGroupedTable} from './filtered-grouped-table'

export class GroupedTable {
    name
    #columns
    #groupBy
    #selectFromGroupBy

    constructor(name, columns, groupBy) {
        this.name = name
        this.#columns = columns
        this.#groupBy = groupBy
        this.#selectFromGroupBy = select => ({ select, from: this.name, groupBy: this.#groupBy })
    }

    filter(f) {
        return new FilteredGroupedTable(this.name, this.#columns, this.#groupBy, f(this.#columns))
    }

    #query(f) {
        return createQuery(this.#selectFromGroupBy(f(this.#columns)))
    }

    map(f) {
        return this.#query(f)
    }

    get(f) {
        return this.#query(f)
    }
}