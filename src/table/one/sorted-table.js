import {mapValues} from 'compose-functions'
import {generateParameterlessQuery} from '../../generation/generate_query'
import {createMapExpression} from '../../expressions/map-expression'
import {createGetExpression} from '../../expressions/get-expression'
import {createQuery} from '../../query'

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
        return createQuery(() => this.generateSelectFromOrderBy('*'))
    }

    map(f) {
        const mapExpressions = mapValues(createMapExpression(0))(this.mapping)

        return createQuery(() => this.generateSelectFromOrderBy(f(mapExpressions)))
    }

    get(f) {
        const getExpressions = mapValues(createGetExpression(0))(this.mapping)

        return createQuery(() => this.generateSelectFromOrderBy(f(getExpressions)))
    }
}