const {createMapExpression} = require('../expressions/map_expressions')
const {mapValues} = require('compose-functions')
const {generateQuery} = require('../generation/generate_query')

class TwoTables {
    firstName
    firstMapping
    secondName
    secondMapping
    firstJoin

    constructor(firstName, firstMapping, secondName, secondMapping, firstJoin) {
        this.firstName = firstName
        this.firstMapping = firstMapping
        this.secondName = secondName
        this.secondMapping = secondMapping
        this.firstJoin = firstJoin

    }

    select() {
        return generateQuery({ select: '*', from: this.firstName, joins: [this.firstJoin] })
    }

    map(f) {
        const firstExpressions = mapValues(createMapExpression(0))(this.firstMapping)
        const secondExpressions = mapValues(createMapExpression(1))(this.secondMapping)

        return generateQuery({ select: f(firstExpressions, secondExpressions), from: this.firstName })
    }

}

module.exports = {
    TwoTables
}