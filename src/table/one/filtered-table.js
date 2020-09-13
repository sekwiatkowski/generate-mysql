const {createGetExpression} = require('../../expressions/get-expression')
const {createMapExpression} = require('../../expressions/map-expression')
const {mapValues} = require('compose-functions')
const {generateQuery} = require('../../generation/generate_query')

class FilteredTable {
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

module.exports = {
    FilteredTable
}