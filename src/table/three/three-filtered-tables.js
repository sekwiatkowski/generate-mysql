import {generateSelectStatement} from '../../generation/statements/generate-select-statement'
import {createCountQuery, createQuery} from '../../query'
import {createColumnsFromMapping} from '../../expressions/column'
import {generateUpdateStatement} from '../../generation/statements/generate-update-statement'

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

        this.generateSelectFromJoinsWhere = select => generateSelectStatement({
            select,
            from: this.firstName,
            joins: [ this.firstJoin, this.secondJoin ],
            where: this.where
        })
    }

    map(f) {
        const firstExpressions = createColumnsFromMapping (0, this.firstMapping)
        const secondExpressions = createColumnsFromMapping (1, this.secondMapping)
        const thirdExpressions = createColumnsFromMapping (2, this.thirdMapping)

        return createQuery(this.generateSelectFromJoinsWhere(f(firstExpressions, secondExpressions, thirdExpressions)))
    }

    get(f) {
        const firstExpressions = createColumnsFromMapping (0, this.firstMapping)
        const secondExpressions = createColumnsFromMapping (1, this.secondMapping)
        const thirdExpressions = createColumnsFromMapping (2, this.thirdMapping)

        return createQuery(this.generateSelectFromJoinsWhere(f(firstExpressions, secondExpressions, thirdExpressions)))
    }

    count() {
        return createCountQuery(this.generateSelectFromJoinsWhere)
    }

    update(f) {
        return generateUpdateStatement({
            tableNames: [this.firstName, this.secondName, this.thirdName],
            mappings: [this.firstMapping, this.secondMapping, this.thirdMapping],
            joins: [this.firstJoin, this.secondJoin],
            where: this.where,
            set: f(0, 1, 2)
        })
    }
}