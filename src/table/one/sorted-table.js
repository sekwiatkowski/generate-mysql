const {createMapExpression} = require('../../expressions/map-expressions')
const {mapValues} = require('compose-functions')
const {generateParameterlessQuery} = require('../../generation/generate_query')

class SortedTable {
    name
    mapping
    orderBy

    constructor(name, mapping, orderBy) {
        this.name = name
        this.mapping = mapping
        this.orderBy = orderBy
    }

    select() {
        return generateParameterlessQuery({ select: '*', from: this.name, orderBy: this.orderBy })
    }

    map(f) {
        const mapExpressions = mapValues(createMapExpression(0))(this.mapping)

        return generateParameterlessQuery({ select: f(mapExpressions), from: this.name, orderBy: this.orderBy })
    }
}

module.exports = {
    SortedTable
}