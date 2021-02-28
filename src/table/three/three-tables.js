import {generateSelectStatement} from '../../generation/statements/generate-select-statement'
import {ThreeFilteredTables} from './three-filtered-tables'
import {createQuery} from '../../query'
import {createColumnsFromMapping} from '../../expressions/column'
import createJoin from '../../expressions/join'
import {FourTables} from '../four/four-tables'

export class ThreeTables {
    firstName
    firstMapping

    secondMapping
    secondColumns

    thirdMapping
    thirdColumns

    firstJoin
    secondJoin

    generateSelectFromJoin

    constructor(firstName, firstMapping, firstColumns, secondMapping, secondColumns, thirdMapping, thirdColumns, firstJoin, secondJoin) {
        this.firstName = firstName
        this.firstMapping = firstMapping
        this.firstColumns = firstColumns

        this.secondMapping = secondMapping
        this.secondColumns = secondColumns

        this.thirdMapping = thirdMapping
        this.thirdColumns = thirdColumns

        this.firstJoin = firstJoin
        this.secondJoin = secondJoin

        this.generateSelectFromJoin = select => generateSelectStatement({ select, from: this.firstName, joins: [ this.firstJoin, this.secondJoin ] })
    }

    innerJoin(otherTable, f) {
        const fourthColumns = createColumnsFromMapping(3, otherTable.mapping)

        const predicate = f(this.firstColumns, this.secondColumns, this.thirdColumns, fourthColumns)
        const thirdJoin = createJoin(3, otherTable.name, predicate)

        return new FourTables(
            this.firstName,
            this.firstMapping,
            this.firstColumns,

            this.secondMapping,
            this.secondColumns,

            this.thirdMapping,
            this.thirdColumns,

            otherTable.mapping,
            fourthColumns,

            this.firstJoin,
            this.secondJoin,
            thirdJoin)
    }

    filter(f) {
        return new ThreeFilteredTables(
            this.firstName, this.firstMapping, this.firstColumns,
            this.secondMapping, this.secondColumns,
            this.thirdMapping, this.thirdColumns,
            this.firstJoin, this.secondJoin,
            f(this.firstColumns, this.secondColumns, this.thirdColumns))
    }

    #query(f) {
        return createQuery(this.generateSelectFromJoin(f(this.firstColumns, this.secondColumns, this.thirdColumns)))
    }

    map(f) {
        return this.#query(f)
    }

    get(f) {
        return this.#query(f)
    }
}