import {generateSelectStatement} from '../../generation/statements/generate-select-statement'
import {createQuery} from '../../query'
import {createColumnsFromMapping} from '../../expressions/column'
import {FilteredGroupedTable} from './filtered-grouped-table'

export class GroupedTable {
    name
    mapping
    groupBy
    generateSelectFromGroupBy

    constructor(name, mapping, groupBy) {
        this.name = name
        this.mapping = mapping
        this.groupBy = groupBy
        this.generateSelectFromGroupBy = select => generateSelectStatement({ select, from: this.name, groupBy: this.groupBy })
    }

    filter(f) {
        const predicate = f(createColumnsFromMapping(0, this.mapping))

        return new FilteredGroupedTable(this.name, this.mapping, this.groupBy, predicate)
    }

    map(f) {
        const columns = createColumnsFromMapping(0, this.mapping)

        return createQuery(this.generateSelectFromGroupBy(f(columns)))
    }

    get(f) {
        const columns = createColumnsFromMapping(0, this.mapping)

        return createQuery(this.generateSelectFromGroupBy(f(columns)))
    }
}