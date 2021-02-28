import {generateSelectStatement} from '../../generation/statements/generate-select-statement'
import {createQuery} from '../../query'
import {createColumnsFromMapping} from '../../expressions/column'

export class SortedTable {
    name
    mapping
    where
    orderBy
    generateSelectFromWhereOrderBy

    constructor(name, mapping, where, orderBy) {
        this.name = name
        this.mapping = mapping
        this.where = where
        this.orderBy = orderBy
        this.generateSelectFromWhereOrderBy = select => generateSelectStatement({ select, from: this.name, where: this.where, orderBy: this.orderBy })
    }

    #createColumns() {
        return createColumnsFromMapping(0, this.mapping)
    }

    #query(f) {
        const columns = this.#createColumns()

        return createQuery(this.generateSelectFromWhereOrderBy(f(columns)))
    }

    map(f) {
        return this.#query(f)
    }

    get(f) {
        return this.#query(f)
    }

    select() {
        return createQuery(this.generateSelectFromWhereOrderBy('*'))
    }
}