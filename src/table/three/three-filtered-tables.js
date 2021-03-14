import {generateSelectStatement} from '../../generation/statements/generate-select-statement'
import {createCountQuery, createQuery} from '../../query'
import {generateUpdateStatement} from '../../generation/statements/generate-update-statement'

export class ThreeFilteredTables {
    #firstName
    #firstColumns

    #secondColumns

    #thirdColumns

    #firstJoin
    #secondJoin

    #where

    #generateSelectFromJoinsWhere

    constructor(firstName, firstColumns, secondColumns, thirdColumns, firstJoin, secondJoin, where) {
        this.#firstName = firstName
        this.#firstColumns = firstColumns

        this.#secondColumns = secondColumns

        this.#thirdColumns = thirdColumns

        this.#firstJoin = firstJoin
        this.#secondJoin = secondJoin

        this.#where = where

        this.#generateSelectFromJoinsWhere = select => generateSelectStatement({
            select,
            from: this.#firstName,
            joins: [ this.#firstJoin, this.#secondJoin ],
            where: this.#where
        })
    }

    #query(f) {
        return createQuery(this.#generateSelectFromJoinsWhere(f(this.#firstColumns, this.#secondColumns, this.#thirdColumns)))
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
            joins: [this.#firstJoin, this.#secondJoin],
            where: this.#where,
            set: f(this.#firstColumns, this.#secondColumns, this.#thirdColumns)
        })
    }
}