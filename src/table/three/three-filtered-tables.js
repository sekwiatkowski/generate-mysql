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

    #selectFromJoinsWhere

    constructor(firstName, firstColumns, secondColumns, thirdColumns, firstJoin, secondJoin, where) {
        this.#firstName = firstName
        this.#firstColumns = firstColumns

        this.#secondColumns = secondColumns

        this.#thirdColumns = thirdColumns

        this.#firstJoin = firstJoin
        this.#secondJoin = secondJoin

        this.#where = where

        this.#selectFromJoinsWhere = select => ({
            select,
            from: this.#firstName,
            joins: [ this.#firstJoin, this.#secondJoin ],
            where: this.#where
        })
    }

    #query(f) {
        return createQuery(this.#selectFromJoinsWhere(f(this.#firstColumns, this.#secondColumns, this.#thirdColumns)))
    }

    map(f) {
        return this.#query(f)
    }

    get(f) {
        return this.#query(f)
    }

    count() {
        return createCountQuery(this.#selectFromJoinsWhere)
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