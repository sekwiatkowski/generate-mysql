import {generateSelectStatement} from '../../generation/statements/generate-select-statement'
import {createQuery} from '../../query'

export class FilteredGroupedTable {
    columns
    generateSelectFromWhereGroupBy

    constructor(name, columns, groupBy, where) {
        this.columns = columns
        this.generateSelectFromWhereGroupBy = select => generateSelectStatement({ select, from: name, where, groupBy })
    }

    #query(f) {
        return createQuery(this.generateSelectFromWhereGroupBy(f(this.columns)))
    }

    map(f) {
        return this.#query(f)
    }

    get(f) {
        return this.#query(f)
    }
}