const {TwoFilteredTables} = require('./two-filtered-tables')
const {ThreeTables} = require('../three/three-tables')
const {createJoin} = require('../../expressions/join')
const {createComparisonExpressions} = require('../../expressions/comparison-expressions')
const {createMapExpression} = require('../../expressions/map-expressions')
const {mapValues} = require('compose-functions')
const {generateQuery} = require('../../generation/generate_query')

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

    innerJoin(otherTable, f) {
        const firstComparisonExpressions = mapValues(createComparisonExpressions(0) (0))(this.firstMapping)
        const secondComparisonExpressions = mapValues(createComparisonExpressions(1) (0))(this.secondMapping)
        const thirdComparisonExpressions = mapValues(createComparisonExpressions(2) (0))(otherTable.mapping)

        const comparison = f(firstComparisonExpressions, secondComparisonExpressions, thirdComparisonExpressions)
        const secondJoin = createJoin(2, otherTable.name, comparison)

        return new ThreeTables(
            this.firstName,
            this.firstMapping,
            this.secondName,
            this.secondMapping,
            otherTable.name,
            otherTable.mapping,
            this.firstJoin,
            secondJoin)
    }

    filter(f) {
        const firstComparisonExpressions = mapValues(createComparisonExpressions(0) (0))(this.firstMapping)
        const secondComparisonExpressions = mapValues(createComparisonExpressions(1) (0))(this.secondMapping)

        return new TwoFilteredTables(
            this.firstName, this.firstMapping,
            this.secondName, this.secondMapping,
            this.firstJoin,
            f(firstComparisonExpressions, secondComparisonExpressions))
    }

    map(f) {
        const firstExpressions = mapValues(createMapExpression(0))(this.firstMapping)
        const secondExpressions = mapValues(createMapExpression(1))(this.secondMapping)

        return generateQuery({
            select: f(firstExpressions, secondExpressions),
            from: this.firstName,
            joins: [ this.firstJoin ]
        })
    }
}

module.exports = {
    TwoTables
}