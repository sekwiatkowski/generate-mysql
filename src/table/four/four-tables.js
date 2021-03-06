import {generateSelectStatement} from '../../generation/statements/generate-select-statement'
import {createQuery} from '../../query'
import {FourFilteredTables} from './four-filtered-tables'

export class FourTables {
    firstName
    firstMapping
    firstColumns

    secondMapping
    secondColumns

    thirdMapping
    thirdColumns

    fourthMapping
    fourthColumns

    firstJoin
    secondJoin

    generateSelectFromJoin

    constructor(firstName, firstMapping, firstColumns, secondMapping, secondColumns, thirdMapping, thirdColumns, fourthMapping, fourthColumns, firstJoin, secondJoin, thirdJoin) {
        this.firstName = firstName
        this.firstColumns = firstColumns
        this.firstMapping = firstMapping

        this.secondMapping = secondMapping
        this.secondColumns = secondColumns

        this.thirdMapping = thirdMapping
        this.thirdColumns = thirdColumns

        this.fourthMapping = fourthMapping
        this.fourthColumns = fourthColumns

        this.firstJoin = firstJoin
        this.secondJoin = secondJoin
        this.thirdJoin = thirdJoin

        this.generateSelectFromJoin = select => generateSelectStatement({ select, from: this.firstName, joins: [ this.firstJoin, this.secondJoin, this.thirdJoin ] })
    }

    filter(f) {
        return new FourFilteredTables(
            this.firstName, this.firstColumns, this.firstMapping,
            this.secondMapping, this.secondColumns,
            this.thirdMapping, this.thirdColumns,
            this.fourthMapping, this.fourthColumns,
            this.firstJoin, this.secondJoin, this.thirdJoin,
            f(this.firstColumns, this.secondColumns, this.thirdColumns, this.fourthColumns))
    }

    #query(f) {
        return createQuery(this.generateSelectFromJoin(f(this.firstColumns, this.secondColumns, this.thirdColumns, this.fourthColumns)))
    }

    map(f) {
        return this.#query(f)
    }

    get(f) {
        return this.#query(f)
    }
}