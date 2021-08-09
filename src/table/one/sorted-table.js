import {createQuery} from '../../query'

export class SortedTable {
    #columns
    #selectFromWhereOrderBy

    constructor(name, columns, where, orderBy) {
        this.#columns = columns
        this.#selectFromWhereOrderBy = select => ({ select, from: name, where, orderBy })
    }

    #query(f) {
        return createQuery(this.#selectFromWhereOrderBy(f(this.#columns)))
    }

    map(f) {
        return this.#query(f)
    }

    get(f) {
        return this.#query(f)
    }

    select() {
        return createQuery(this.#selectFromWhereOrderBy('*'))
    }
}