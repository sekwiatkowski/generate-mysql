import {generateSelectStatement} from '../../generation/statements/generate-select-statement'
import {createCountQuery, createQuery} from '../../query'
import {generateUpdateStatement} from '../../generation/statements/generate-update-statement'

export class FourFilteredTables {
    #firstName
    #firstMapping
    #firstColumns

    #secondMapping
    #secondColumns

    #thirdMapping
    #thirdColumns

    #fourthMapping
    #fourthColumns

    #firstJoin

    #where

    #generateSelectFromJoinsWhere

    constructor(firstName, firstMapping, firstColumns, secondMapping, secondColumns, thirdMapping, thirdColumns, fourthMapping, fourthColumns, firstJoin, secondJoin, thirdJoin, where) {
        this.#firstName = firstName
        this.#firstMapping = firstMapping
        this.#firstColumns = firstColumns

        this.#secondMapping = secondMapping
        this.#secondColumns = secondColumns

        this.#thirdMapping = thirdMapping
        this.#thirdColumns = thirdColumns

        this.#fourthMapping = fourthMapping
        this.#fourthColumns = fourthColumns

        this.#firstJoin = firstJoin
        this.secondJoin = secondJoin
        this.thirdJoin = thirdJoin

        this.#where = where

        this.#generateSelectFromJoinsWhere = select => generateSelectStatement({
            select,
            from: this.#firstName,
            joins: [ this.#firstJoin, this.secondJoin, this.thirdJoin ],
            where: this.#where
        })
    }

    #query(f) {
        return createQuery(this.#generateSelectFromJoinsWhere(f(this.#firstColumns, this.#secondColumns, this.#thirdColumns, this.#fourthColumns)))
    }

    map(f) {
        return this.#query(f)
    }

    get(f) {
        return this.#query(f)
    }

    count() {
        return createCountQuery(this.#generateSelectFromJoinsWhere)
    }

    update(f) {
        return generateUpdateStatement({
            firstTableName: this.#firstName,
            mappings: [this.#firstMapping, this.#secondMapping, this.#thirdMapping, this.#fourthMapping],
            joins: [this.#firstJoin, this.secondJoin, this.thirdJoin],
            where: this.#where,
            set: f(0, 1, 2, 3)
        })
    }
}