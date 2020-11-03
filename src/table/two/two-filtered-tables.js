import {mapValues} from 'compose-functions'
import {generateQuery} from '../../generation/generate-query'
import {createQuery} from '../../query'
import createColumn from '../../expressions/column'

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
        const firstColumns = mapValues(createColumn(0)) (this.firstMapping)
        const secondColumns = mapValues(createColumn(1)) (this.secondMapping)

        return createQuery(this.generateSelectFromJoinsWhere(f(firstColumns, secondColumns)))
    }

    get(f) {
        const firstColumns = mapValues(createColumn(0))(this.firstMapping)
        const secondColumns = mapValues(createColumn(1))(this.secondMapping)

        return createQuery(this.generateSelectFromJoinsWhere(f(firstColumns, secondColumns)))
    }
}