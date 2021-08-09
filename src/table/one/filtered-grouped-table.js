import {createQuery} from '../../query'

export class FilteredGroupedTable {
    #columns
    #selectFromWhereGroupBy

    constructor(name, columns, groupBy, where) {
        this.#columns = columns
        this.#selectFromWhereGroupBy = select => ({ select, from: name, where, groupBy })
    }

    #query(f) {
        return createQuery(this.#selectFromWhereGroupBy(f(this.#columns)))
    }

    map(f) {
        return this.#query(f)
    }

    get(f) {
        return this.#query(f)
    }
}