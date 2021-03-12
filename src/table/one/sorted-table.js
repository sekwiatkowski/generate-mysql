import {generateSelectStatement} from '../../generation/statements/generate-select-statement'
import {createQuery} from '../../query'

export class SortedTable {
    #columns
    #generateSelectFromWhereOrderBy

    constructor(name, columns, where, orderBy) {
        this.#columns = columns
        this.#generateSelectFromWhereOrderBy = select => generateSelectStatement({ select, from: name, where, orderBy })
    }

    #query(f) {
        return createQuery(this.#generateSelectFromWhereOrderBy(f(this.#columns)))
    }

    map(f) {
        return this.#query(f)
    }

    get(f) {
        return this.#query(f)
    }

    select() {
        return createQuery(this.#generateSelectFromWhereOrderBy('*'))
    }
}