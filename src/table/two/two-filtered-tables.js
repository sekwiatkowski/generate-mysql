import {mapValues} from 'compose-functions'
import createMapExpression from '../../expressions/map-expression'
import createGetExpression from '../../expressions/get-expression'
import {generateQuery} from '../../generation/generate_query'
import {createQuery} from '../../query'

export class TwoFilteredTables {
    firstName
    firstMapping
    secondName
    secondMapping

    firstJoin

    where

    generateSelectFromJoinsWhere

    constructor(firstName, firstMapping, secondName, secondMapping, firstJoin, where) {
        this.firstName = firstName
        this.firstMapping = firstMapping
        this.secondName = secondName
        this.secondMapping = secondMapping

        this.firstJoin = firstJoin
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

        return createQuery(() => this.generateSelectFromJoinsWhere(f(firstExpressions, secondExpressions)))
    }

    get(f) {
        const firstExpressions = mapValues(createGetExpression(0))(this.firstMapping)
        const secondExpressions = mapValues(createGetExpression(1))(this.secondMapping)

        return createQuery(() => this.generateSelectFromJoinsWhere(f(firstExpressions, secondExpressions)))
    }
}