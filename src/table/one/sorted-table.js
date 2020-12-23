import {generateQuery} from '../../generation/generate-query'
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
        this.generateSelectFromWhereOrderBy = select => generateQuery({ select, from: this.name, where: this.where, orderBy: this.orderBy })
    }

    select() {
        return createQuery(this.generateSelectFromWhereOrderBy('*'))
    }

    map(f) {
        const columns = createColumnsFromMapping(0, this.mapping)

        return createQuery(this.generateSelectFromWhereOrderBy(f(columns)))
    }

    get(f) {
        const columns = createColumnsFromMapping(0, this.mapping)

        return createQuery(this.generateSelectFromWhereOrderBy(f(columns)))
    }
}