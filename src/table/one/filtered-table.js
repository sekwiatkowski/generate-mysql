import {generateQuery} from '../../generation/generate-query'
import {createCountQuery, createQuery} from '../../query'
import generateUpdate from '../../generation/generate-update'
import {createColumnsFromMapping} from '../../expressions/column'
import {generateFilteredDelete} from '../../generation/generate-delete'
import {createAscendingOrdersFromMapping, createDescendingOrdersFromMapping} from '../../expressions/order'
import {SortedTable} from './sorted-table'
import set from '../../expressions/update'

export class FilteredTable {
    name
    mapping
    where
    generateSelectFromWhere

    constructor(name, mapping, where) {
        this.name = name
        this.mapping = mapping
        this.where = where
        this.generateSelectFromWhere = select => generateQuery({ select, from: this.name, where: this.where })
    }

    sortBy(f) {
        const orders = createAscendingOrdersFromMapping(0, this.mapping)

        return new SortedTable(this.name, this.mapping, this.where, f(orders))
    }

    sortDescendinglyBy(f) {
        const orders = createDescendingOrdersFromMapping(0, this.mapping)

        return new SortedTable(this.name, this.mapping, this.where, f(orders))
    }

    select() {
        return createQuery(this.generateSelectFromWhere('*'))
    }

    map(f) {
        const columns = createColumnsFromMapping(0, this.mapping)

        return createQuery(this.generateSelectFromWhere(f(columns)))
    }

    get(f) {
        const columns = createColumnsFromMapping(0, this.mapping)

        return createQuery(this.generateSelectFromWhere(f(columns)))
    }

    count() {
        return createCountQuery(this.generateSelectFromWhere)
    }

    update(partialObject) {
        return generateUpdate({ tableNames: [this.name], mappings: [this.mapping], where: this.where, set: set(0, partialObject)})
    }

    delete() {
        return generateFilteredDelete(this.name) (this.where)
    }
}