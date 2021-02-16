import {generateQuery} from '../../generation/generate-query'
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
        this.generateSelectFromWhereGroupBy = select => generateQuery({ select, from: this.name, where: this.where, groupBy: this.groupBy })
    }

    select() {
        return createQuery(this.generateSelectFromWhereGroupBy('*'))
    }

    map(f) {
        const columns = createColumnsFromMapping(0, this.mapping)

        return createQuery(this.generateSelectFromWhereGroupBy(f(columns)))
    }

    get(f) {
        const columns = createColumnsFromMapping(0, this.mapping)

        return createQuery(this.generateSelectFromWhereGroupBy(f(columns)))
    }
}