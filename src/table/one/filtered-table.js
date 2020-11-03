import {generateQuery} from '../../generation/generate-query'
import {mapValues} from 'compose-functions'
import {createQuery} from '../../query'
import generateUpdate from '../../generation/generate-update'
import createColumn from '../../expressions/column'

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

    select() {
        return createQuery(this.generateSelectFromWhere('*'))
    }

    map(f) {
        const columns = mapValues(createColumn(0))(this.mapping)

        return createQuery(this.generateSelectFromWhere(f(columns)))
    }

    get(f) {
        const columns = mapValues(createColumn(0))(this.mapping)

        return createQuery(this.generateSelectFromWhere(f(columns)))
    }

    update(partialObject) {
        return generateUpdate(this.name) (this.mapping) (this.where) (partialObject)
    }
}