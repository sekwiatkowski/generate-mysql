import {generateSelectStatement} from '../../generation/statements/generate-select-statement'
import {createCountQuery, createQuery} from '../../query'
import {createColumnsFromMapping} from '../../expressions/column'
import {generateUpdateStatement} from '../../generation/statements/generate-update-statement'

export class FourFilteredTables {
    firstName
    firstMapping
    secondName
    secondMapping
    thirdName
    thirdMapping
    fourthName
    fourthMapping

    firstJoin

    where

    generateSelectFromJoinsWhere

    constructor(firstName, firstMapping, secondName, secondMapping, thirdName, thirdMapping, fourthName, fourthMapping, firstJoin, secondJoin, thirdJoin, where) {
        this.firstName = firstName
        this.firstMapping = firstMapping
        this.secondName = secondName
        this.secondMapping = secondMapping
        this.thirdName = thirdName
        this.thirdMapping = thirdMapping
        this.fourthName = fourthName
        this.fourthMapping = fourthMapping

        this.firstJoin = firstJoin
        this.secondJoin = secondJoin
        this.thirdJoin = thirdJoin

        this.where = where

        this.generateSelectFromJoinsWhere = select => generateSelectStatement({
            select,
            from: this.firstName,
            joins: [ this.firstJoin, this.secondJoin, this.thirdJoin ],
            where: this.where
        })
    }

    #createColumns() {
        return [
            createColumnsFromMapping (0, this.firstMapping),
            createColumnsFromMapping (1, this.secondMapping),
            createColumnsFromMapping (2, this.thirdMapping),
            createColumnsFromMapping (3, this.fourthMapping)
        ]
    }

    #query(f) {
        const [firstColumns, secondColumns, thirdColumns, fourthColumns] = this.#createColumns()

        return createQuery(this.generateSelectFromJoinsWhere(f(firstColumns, secondColumns, thirdColumns, fourthColumns)))
    }

    map(f) {
        return this.#query(f)
    }

    get(f) {
        return this.#query(f)
    }

    count() {
        return createCountQuery(this.generateSelectFromJoinsWhere)
    }

    update(f) {
        return generateUpdateStatement({
            tableNames: [this.firstName, this.secondName, this.thirdName, this.fourthName],
            mappings: [this.firstMapping, this.secondMapping, this.thirdMapping, this.fourthMapping],
            joins: [this.firstJoin, this.secondJoin, this.thirdJoin],
            where: this.where,
            set: f(0, 1, 2, 3)
        })
    }
}