import {generateSelectStatement} from '../../generation/statements/generate-select-statement'
import {createCountQuery, createQuery} from '../../query'
import {createColumnsFromMapping} from '../../expressions/column'
import {generateFilteredDelete} from '../../generation/statements/generate-delete-statement'
import {createAscendingOrdersFromMapping, createDescendingOrdersFromMapping} from '../../expressions/order'
import {SortedTable} from './sorted-table'
import {set} from '../../expressions/update'
import {generateUpdateStatement} from '../../generation/statements/generate-update-statement'

export class FilteredTable {
    name
    mapping
    where
    generateSelectFromWhere

    constructor(name, mapping, where) {
        this.name = name
        this.mapping = mapping
        this.where = where
        this.generateSelectFromWhere = select => generateSelectStatement({ select, from: this.name, where: this.where })
    }

    sortBy(f) {
        const orders = createAscendingOrdersFromMapping(0, this.mapping)

        return new SortedTable(this.name, this.mapping, this.where, f(orders))
    }

    sortDescendinglyBy(f) {
        const orders = createDescendingOrdersFromMapping(0, this.mapping)

        return new SortedTable(this.name, this.mapping, this.where, f(orders))
    }

    #createColumns() {
        return createColumnsFromMapping(0, this.mapping)
    }

    #query(f) {
        const columns = this.#createColumns()

        return createQuery(this.generateSelectFromWhere(f(columns)))
    }

    map(f) {
        return this.#query(f)
    }

    get(f) {
        return this.#query(f)
    }

    select() {
        return createQuery(this.generateSelectFromWhere('*'))
    }

    count() {
        return createCountQuery(this.generateSelectFromWhere)
    }

    update(partialObject) {
        return generateUpdateStatement({
            tableNames: [this.name],
            mappings: [this.mapping],
            where: this.where,
            set: set(0, partialObject)
        })
    }

    delete() {
        return generateFilteredDelete(this.name) (this.where)
    }
}