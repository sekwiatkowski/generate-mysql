import {generateParameterlessQuery} from '../../generation/generate-query'
import {createQuery} from '../../query'
import {createColumnsFromMapping} from '../../expressions/column'

export class SortedTable {
    name
    mapping
    orderBy
    generateSelectFromOrderBy

    constructor(name, mapping, orderBy) {
        this.name = name
        this.mapping = mapping
        this.orderBy = orderBy
        this.generateSelectFromOrderBy = select => generateParameterlessQuery({ select, from: this.name, orderBy: this.orderBy })
    }

    select() {
        return createQuery(this.generateSelectFromOrderBy('*'))
    }

    map(f) {
        const columns = createColumnsFromMapping(0, this.mapping)

        return createQuery(this.generateSelectFromOrderBy(f(columns)))
    }

    get(f) {
        const columns = createColumnsFromMapping(0, this.mapping)

        return createQuery(this.generateSelectFromOrderBy(f(columns)))
    }
}