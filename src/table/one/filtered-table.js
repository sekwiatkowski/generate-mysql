import {createCountQuery, createQuery} from '../../query'
import {generateFilteredDeleteStatement} from '../../generation/statements/generate-delete-statement'
import {createAscendingOrdersFromColumns, createDescendingOrdersFromColumns} from '../../expressions/order'
import {SortedTable} from './sorted-table'
import {set} from '../../expressions/update'
import {generateUpdateStatement} from '../../generation/statements/generate-update-statement'
import {isObject} from 'standard-functions'

export class FilteredTable {
    #name
    #columns
    #where
    #selectFromWhere

    constructor(name, columns, where) {
        this.#name = name
        this.#columns = columns
        this.#where = where
        this.#selectFromWhere = select => ({ select, from: this.#name, where: this.#where })
    }

    sortBy(f) {
        const orders = createAscendingOrdersFromColumns(this.#columns)

        return new SortedTable(this.#name, this.#columns, this.#where, f(orders))
    }

    sortDescendinglyBy(f) {
        const orders = createDescendingOrdersFromColumns(this.#columns)

        return new SortedTable(this.#name, this.#columns, this.#where, f(orders))
    }

    #query(f) {
        return createQuery(this.#selectFromWhere(f(this.#columns)))
    }

    map(f) {
        return this.#query(f)
    }

    get(f) {
        return this.#query(f)
    }

    select() {
        return createQuery(this.#selectFromWhere('*'))
    }

    count() {
        return createCountQuery(this.#selectFromWhere)
    }

    update(assignment) {
        return generateUpdateStatement({
            firstTableName: this.#name,
            where: this.#where,
            set: set(
                this.#columns,
                isObject(assignment) ? assignment : assignment(this.#columns)
            )
        })
    }

    delete() {
        return generateFilteredDeleteStatement(this.#name) (this.#where)
    }
}