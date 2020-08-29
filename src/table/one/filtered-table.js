const {createMapExpression} = require('../../expressions/map-expressions')
const {mapValues} = require('compose-functions')
const {generateQuery} = require('../../generation/generate_query')

class FilteredTable {
    name
    mapping
    where

    constructor(name, mapping, where) {
        this.name = name
        this.mapping = mapping
        this.where = where
    }

    select() {
        return generateQuery({ select: '*', from: this.name, where: this.where })
    }

    map(f) {
        const mapExpressions = mapValues(createMapExpression(0))(this.mapping)

        return generateQuery({ select: f(mapExpressions), from: this.name, where: this.where })
    }
}

module.exports = {
    FilteredTable
}