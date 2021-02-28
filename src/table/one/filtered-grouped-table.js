import {generateSelectStatement} from '../../generation/statements/generate-select-statement'
import {createQuery} from '../../query'
import {createColumnsFromMapping} from '../../expressions/column'

export class FilteredGroupedTable {
    name
    mapping
    groupBy
    generateSelectFromWhereGroupBy

    constructor(name, mapping, groupBy, where) {
        this.name = name
        this.mapping = mapping
        this.groupBy = groupBy
        this.where = where
        this.generateSelectFromWhereGroupBy = select => generateSelectStatement({ select, from: this.name, where: this.where, groupBy: this.groupBy })
    }

    #createColumns() {
        return createColumnsFromMapping(0, this.mapping)
    }

    #query(f) {
        const columns = this.#createColumns()

        return createQuery(this.generateSelectFromWhereGroupBy(f(columns)))
    }

    map(f) {
        return this.#query(f)
    }

    get(f) {
        return this.#query(f)
    }
}