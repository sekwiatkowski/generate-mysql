const {ThreeFilteredTables} = require('./three-filtered-tables')
const {createComparisonExpressions} = require('../../expressions/comparison-expressions')
const {createMapExpression} = require('../../expressions/map-expressions')
const {mapValues} = require('compose-functions')
const {generateQuery} = require('../../generation/generate_query')

class ThreeTables {
    firstName
    firstMapping
    secondName
    secondMapping
    thirdName
    thirdMapping

    firstJoin
    secondJoin

    constructor(firstName, firstMapping, secondName, secondMapping, thirdName, thirdMapping, firstJoin, secondJoin) {
        this.firstName = firstName
        this.firstMapping = firstMapping
        this.secondName = secondName
        this.secondMapping = secondMapping
        this.thirdName = thirdName
        this.thirdMapping = thirdMapping

        this.firstJoin = firstJoin
        this.secondJoin = secondJoin
    }

    filter(f) {
        const firstComparisonExpressions = mapValues(createComparisonExpressions(0) (0))(this.firstMapping)
        const secondComparisonExpressions = mapValues(createComparisonExpressions(1) (0))(this.secondMapping)
        const thirdComparisonExpressions = mapValues(createComparisonExpressions(2) (0))(this.thirdMapping)

        return new ThreeFilteredTables(
            this.firstName, this.firstMapping,
            this.secondName, this.secondMapping,
            this.thirdName, this.thirdMapping,
            this.firstJoin, this.secondJoin,
            f(firstComparisonExpressions, secondComparisonExpressions, thirdComparisonExpressions))
    }

    map(f) {
        const firstExpressions = mapValues(createMapExpression(0))(this.firstMapping)
        const secondExpressions = mapValues(createMapExpression(1))(this.secondMapping)
        const thirdExpressions = mapValues(createMapExpression(2))(this.thirdMapping)

        return generateQuery({
            select: f(firstExpressions, secondExpressions, thirdExpressions),
            from: this.firstName,
            joins: [ this.firstJoin, this.secondJoin ]
        })
    }

}

module.exports = {
    ThreeTables
}