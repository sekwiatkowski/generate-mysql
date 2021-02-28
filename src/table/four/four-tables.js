import {generateSelectStatement} from '../../generation/statements/generate-select-statement'
import {createQuery} from '../../query'
import {createColumnsFromMapping} from '../../expressions/column'
import {FourFilteredTables} from './four-filtered-tables'

export class FourTables {
    firstName
    firstMapping
    secondName
    secondMapping
    thirdName
    thirdMapping
    fourthName
    fourthMapping

    firstJoin
    secondJoin

    generateSelectFromJoin

    constructor(firstName, firstMapping, secondName, secondMapping, thirdName, thirdMapping, fourthName, fourthMapping, firstJoin, secondJoin, thirdJoin) {
        this.firstName = firstName
        this.firstMapping = firstMapping
        this.secondName = secondName
        this.secondMapping = secondMapping
        this.thirdName = thirdName
        this.thirdMapping = thirdMapping
        this.fourthName = fourthName
        this.fourthMapping = fourthMapping

        this.firstJoin = firstJoin
        this.secondJoin = secondJoin
        this.thirdJoin = thirdJoin

        this.generateSelectFromJoin = select => generateSelectStatement({ select, from: this.firstName, joins: [ this.firstJoin, this.secondJoin, this.thirdJoin ] })
    }

    #createColumns() {
        return [
            createColumnsFromMapping (0, this.firstMapping),
            createColumnsFromMapping (1, this.secondMapping),
            createColumnsFromMapping (2, this.thirdMapping),
            createColumnsFromMapping (3, this.fourthMapping)
        ]
    }

    filter(f) {
        const [firstColumns, secondColumns, thirdColumns, fourthColumns] = this.#createColumns()

        return new FourFilteredTables(
            this.firstName, this.firstMapping,
            this.secondName, this.secondMapping,
            this.thirdName, this.thirdMapping,
            this.fourthName, this.fourthMapping,
            this.firstJoin, this.secondJoin,
            f(firstColumns, secondColumns, thirdColumns, fourthColumns))
    }

    #query(f) {
        const [firstColumns, secondColumns, thirdColumns, fourthColumns] = this.#createColumns()

        return createQuery(this.generateSelectFromJoin(f(firstColumns, secondColumns, thirdColumns, fourthColumns)))
    }

    map(f) {
        return this.#query(f)
    }

    get(f) {
        return this.#query(f)
    }
}