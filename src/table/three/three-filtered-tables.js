const {createMapExpression} = require('../../expressions/map-expressions')
const {mapValues} = require('compose-functions')
const {generateQuery} = require('../../generation/generate_query')

class ThreeFilteredTables {
    firstName
    firstMapping
    secondName
    secondMapping
    thirdName
    thirdMapping

    firstJoin

    where

    constructor(firstName, firstMapping, secondName, secondMapping, thirdName, thirdMapping, firstJoin, secondJoin, where) {
        this.firstName = firstName
        this.firstMapping = firstMapping
        this.secondName = secondName
        this.secondMapping = secondMapping
        this.thirdName = thirdName
        this.thirdMapping = thirdMapping

        this.firstJoin = firstJoin
        this.secondJoin = secondJoin

        this.where = where
    }

    map(f) {
        const firstExpressions = mapValues(createMapExpression(0)) (this.firstMapping)
        const secondExpressions = mapValues(createMapExpression(1)) (this.secondMapping)
        const thirdExpressions = mapValues(createMapExpression(2)) (this.thirdMapping)

        return generateQuery({
            select: f(firstExpressions, secondExpressions, thirdExpressions),
            from: this.firstName,
            joins: [ this.firstJoin ],
            where: this.where
        })
    }
}

module.exports = {
    ThreeFilteredTables
}