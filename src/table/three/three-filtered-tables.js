import {mapValues} from 'compose-functions'
import {generateQuery} from '../../generation/generate_query'
import {createMapExpression} from '../../expressions/map-expression'
import {createGetExpression} from '../../expressions/get-expression'

export class ThreeFilteredTables {
    firstName
    firstMapping
    secondName
    secondMapping
    thirdName
    thirdMapping

    firstJoin

    where

    generateSelectFromJoinsWhere

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

        this.generateSelectFromJoinsWhere = select => generateQuery({
            select,
            from: this.firstName,
            joins: [ this.firstJoin ],
            where: this.where
        })
    }

    map(f) {
        const firstExpressions = mapValues(createMapExpression(0)) (this.firstMapping)
        const secondExpressions = mapValues(createMapExpression(1)) (this.secondMapping)
        const thirdExpressions = mapValues(createMapExpression(2)) (this.thirdMapping)

        return this.generateSelectFromJoinsWhere(f(firstExpressions, secondExpressions, thirdExpressions))
    }

    get(f) {
        const firstExpressions = mapValues(createGetExpression(0)) (this.firstMapping)
        const secondExpressions = mapValues(createGetExpression(1)) (this.secondMapping)
        const thirdExpressions = mapValues(createGetExpression(2)) (this.thirdMapping)

        return this.generateSelectFromJoinsWhere(f(firstExpressions, secondExpressions, thirdExpressions))
    }
}