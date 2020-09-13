const {createGetExpression} = require('../../expressions/get-expression')
const {createMapExpression} = require('../../expressions/map-expression')
const {mapValues} = require('compose-functions')
const {generateParameterlessQuery} = require('../../generation/generate_query')

class SortedTable {
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
        return this.generateSelectFromOrderBy('*')
    }

    map(f) {
        const mapExpressions = mapValues(createMapExpression(0))(this.mapping)

        return this.generateSelectFromOrderBy(f(mapExpressions))
    }

    get(f) {
        const getExpressions = mapValues(createGetExpression(0))(this.mapping)

        return this.generateSelectFromOrderBy(f(getExpressions))
    }
}

module.exports = {
    SortedTable
}