import {mapValues} from 'compose-functions'
import {generateQuery} from '../../generation/generate-query'
import {createQuery} from '../../query'
import createColumn from '../../expressions/column'

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
            joins: [ this.firstJoin, this.secondJoin ],
            where: this.where
        })
    }

    map(f) {
        const firstExpressions = mapValues(createColumn(0)) (this.firstMapping)
        const secondExpressions = mapValues(createColumn(1)) (this.secondMapping)
        const thirdExpressions = mapValues(createColumn(2)) (this.thirdMapping)

        return createQuery(() => this.generateSelectFromJoinsWhere(f(firstExpressions, secondExpressions, thirdExpressions)))
    }

    get(f) {
        const firstExpressions = mapValues(createColumn(0)) (this.firstMapping)
        const secondExpressions = mapValues(createColumn(1)) (this.secondMapping)
        const thirdExpressions = mapValues(createColumn(2)) (this.thirdMapping)

        return createQuery(() => this.generateSelectFromJoinsWhere(f(firstExpressions, secondExpressions, thirdExpressions)))
    }
}