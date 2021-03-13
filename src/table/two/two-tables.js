import createJoin from '../../expressions/join'
import {TwoFilteredTables} from './two-filtered-tables'
import {generateSelectStatement} from '../../generation/statements/generate-select-statement'
import {ThreeTables} from '../three/three-tables'
import {createQuery} from '../../query'
import {createColumnsFromMapping} from '../../expressions/column'

export class TwoTables {
    #firstName
    #firstColumns

    #secondColumns

    #firstJoin

    #generateSelectFromJoins

    constructor(firstName, firstColumns, secondColumns, firstJoin) {
        this.#firstName = firstName
        this.#firstColumns = firstColumns

        this.#secondColumns = secondColumns

        this.#firstJoin = firstJoin

        this.#generateSelectFromJoins = select => generateSelectStatement({
            select,
            from: this.#firstName,
            joins: [ this.#firstJoin ]
        })
    }

    innerJoin(otherTable, f) {
        const thirdColumns = createColumnsFromMapping(2, otherTable.mapping)

        const predicate = f(this.#firstColumns, this.#secondColumns, thirdColumns)
        const secondJoin = createJoin(2, otherTable.name, predicate)

        return new ThreeTables(
            this.#firstName, this.#firstColumns,
            this.#secondColumns,
            thirdColumns,

            this.#firstJoin,
            secondJoin)
    }

    filter(f) {
        return new TwoFilteredTables(
            this.#firstName, this.#firstColumns,
            this.#secondColumns,

            this.#firstJoin,
            f(this.#firstColumns, this.#secondColumns))
    }

    #query(f) {
        return createQuery(this.#generateSelectFromJoins(f(this.#firstColumns, this.#secondColumns)))
    }

    map(f) {
        return this.#query(f)
    }

    get(f) {
        return this.#query(f)
    }
}
