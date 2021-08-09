import {createCountQuery, createQuery} from '../../query'
import {generateUpdateStatement} from '../../generation/statements/generate-update-statement'

export class TwoFilteredTables {
    #firstName
    #firstColumns

    #secondColumns

    #firstJoin

    #where

    #selectFromJoinsWhere

    constructor(firstName, firstColumns, secondColumns, firstJoin, where) {
        this.#firstName = firstName
        this.#firstColumns = firstColumns

        this.#secondColumns = secondColumns

        this.#firstJoin = firstJoin
        this.#where = where

        this.#selectFromJoinsWhere = select => ({
            select,
            from: this.#firstName,
            joins: [ this.#firstJoin ],
            where: this.#where
        })
    }

    #query(f) {
        return createQuery(this.#selectFromJoinsWhere(f(this.#firstColumns, this.#secondColumns)))
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
            joins: [this.#firstJoin],
            where: this.#where,
            set: f(this.#firstColumns, this.#secondColumns)
        })
    }
}