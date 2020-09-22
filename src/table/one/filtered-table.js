import {generateQuery} from '../../generation/generate_query'
import {mapValues} from 'compose-functions'
import {createMapExpression} from '../../expressions/map-expression'
import {createGetExpression} from '../../expressions/get-expression'

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
        return this.generateSelectFromWhere('*')
    }

    map(f) {
        const mapExpressions = mapValues(createMapExpression(0))(this.mapping)

        return this.generateSelectFromWhere(f(mapExpressions))
    }

    get(f) {
        const getExpressions = mapValues(createGetExpression(0))(this.mapping)

        return this.generateSelectFromWhere(f(getExpressions))
    }
}