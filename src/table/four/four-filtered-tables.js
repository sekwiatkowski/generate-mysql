import {generateSelectStatement} from '../../generation/statements/generate-select-statement'
import {createCountQuery, createQuery} from '../../query'
import {generateUpdateStatement} from '../../generation/statements/generate-update-statement'

export class FourFilteredTables {
    #firstName
    #firstColumns

    #secondColumns

    #thirdColumns

    #fourthColumns

    #firstJoin
    #secondJoin
    #thirdJoin

    #where

    #generateSelectFromJoinsWhere

    constructor(firstName, firstColumns, secondColumns, thirdColumns, fourthColumns, firstJoin, secondJoin, thirdJoin, where) {
        this.#firstName = firstName
        this.#firstColumns = firstColumns

        this.#secondColumns = secondColumns

        this.#thirdColumns = thirdColumns

        this.#fourthColumns = fourthColumns

        this.#firstJoin = firstJoin
        this.#secondJoin = secondJoin
        this.#thirdJoin = thirdJoin

        this.#where = where

        this.#generateSelectFromJoinsWhere = select => generateSelectStatement({
            select,
            from: this.#firstName,
            joins: [ this.#firstJoin, this.#secondJoin, this.#thirdJoin ],
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
            joins: [this.#firstJoin],
            where: this.#where,
            set: f(this.#firstColumns, this.#secondColumns, this.#thirdColumns, this.#firstColumns)
        })
    }
}