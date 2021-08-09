import {createQuery} from '../../query'
import {FourFilteredTables} from './four-filtered-tables'

export class FourTables {
    #firstName
    #firstColumns

    #secondColumns

    #thirdColumns

    #fourthColumns

    #firstJoin
    #secondJoin
    #thirdJoin

    #selectFromJoin

    constructor(firstName, firstColumns, secondColumns, thirdColumns, fourthColumns, firstJoin, secondJoin, thirdJoin) {
        this.#firstName = firstName
        this.#firstColumns = firstColumns

        this.#secondColumns = secondColumns

        this.#thirdColumns = thirdColumns

        this.#fourthColumns = fourthColumns

        this.#firstJoin = firstJoin
        this.#secondJoin = secondJoin
        this.#thirdJoin = thirdJoin

        this.#selectFromJoin = select => ({
            select, from: this.#firstName, joins: [ this.#firstJoin, this.#secondJoin, this.#thirdJoin ]
        })
    }

    filter(f) {
        return new FourFilteredTables(
            this.#firstName, this.#firstColumns,
            this.#secondColumns,
            this.#thirdColumns,
            this.#fourthColumns,
            this.#firstJoin, this.#secondJoin, this.#thirdJoin,
            f(this.#firstColumns, this.#secondColumns, this.#thirdColumns, this.#fourthColumns))
    }

    #query(f) {
        return createQuery(this.#selectFromJoin(f(this.#firstColumns, this.#secondColumns, this.#thirdColumns, this.#fourthColumns)))
    }

    map(f) {
        return this.#query(f)
    }

    get(f) {
        return this.#query(f)
    }
}