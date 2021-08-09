import {ThreeFilteredTables} from './three-filtered-tables'
import {createQuery} from '../../query'
import {createColumnsFromMapping} from '../../expressions/column'
import createJoin from '../../expressions/join'
import {FourTables} from '../four/four-tables'

export class ThreeTables {
    #firstName
    #firstColumns

    #secondColumns

    #thirdColumns

    #firstJoin
    #secondJoin

    #selectFromJoin

    constructor(firstName, firstColumns, secondColumns, thirdColumns, firstJoin, secondJoin) {
        this.#firstName = firstName
        this.#firstColumns = firstColumns

        this.#secondColumns = secondColumns

        this.#thirdColumns = thirdColumns

        this.#firstJoin = firstJoin
        this.#secondJoin = secondJoin

        this.#selectFromJoin = select => ({ select, from: this.#firstName, joins: [ this.#firstJoin, this.#secondJoin ] })
    }

    innerJoin(otherTable, f) {
        const fourthColumns = createColumnsFromMapping(3, otherTable.mapping)

        const predicate = f(this.#firstColumns, this.#secondColumns, this.#thirdColumns, fourthColumns)
        const thirdJoin = createJoin(3, otherTable.name, predicate)

        return new FourTables(
            this.#firstName,
            this.#firstColumns,

            this.#secondColumns,

            this.#thirdColumns,

            fourthColumns,

            this.#firstJoin,
            this.#secondJoin,
            thirdJoin)
    }

    filter(f) {
        return new ThreeFilteredTables(
            this.#firstName, this.#firstColumns,
            this.#secondColumns,
            this.#thirdColumns,
            this.#firstJoin, this.#secondJoin,
            f(this.#firstColumns, this.#secondColumns, this.#thirdColumns))
    }

    #query(f) {
        return createQuery(this.#selectFromJoin(f(this.#firstColumns, this.#secondColumns, this.#thirdColumns)))
    }

    map(f) {
        return this.#query(f)
    }

    get(f) {
        return this.#query(f)
    }
}