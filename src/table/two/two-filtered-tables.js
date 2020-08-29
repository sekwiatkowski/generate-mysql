const {ThreeTables} = require('../three/three-tables')
const {createJoin} = require('../../expressions/join')
const {createComparisonExpressions} = require('../../expressions/comparison-expressions')
const {createMapExpression} = require('../../expressions/map-expressions')
const {mapValues} = require('compose-functions')
const {generateQuery} = require('../../generation/generate_query')

class TwoFilteredTables {
    firstName
    firstMapping
    secondName
    secondMapping

    firstJoin

    where

    constructor(firstName, firstMapping, secondName, secondMapping, firstJoin, where) {
        this.firstName = firstName
        this.firstMapping = firstMapping
        this.secondName = secondName
        this.secondMapping = secondMapping

        this.firstJoin = firstJoin
        this.where = where
    }

    map(f) {
        const firstExpressions = mapValues(createMapExpression(0)) (this.firstMapping)
        const secondExpressions = mapValues(createMapExpression(1)) (this.secondMapping)

        return generateQuery({
            select: f(firstExpressions, secondExpressions),
            from: this.firstName,
            joins: [ this.firstJoin ],
            where: this.where
        })
    }
}

module.exports = {
    TwoFilteredTables
}