import {generateSelectStatement} from '../../generation/statements/generate-select-statement'
import {ThreeFilteredTables} from './three-filtered-tables'
import {createQuery} from '../../query'
import {createColumnsFromMapping} from '../../expressions/column'
import createJoin from '../../expressions/join'
import {FourTables} from '../four/four-tables'

export class ThreeTables {
    firstName
    firstMapping
    secondName
    secondMapping
    thirdName
    thirdMapping

    firstJoin
    secondJoin

    generateSelectFromJoin

    constructor(firstName, firstMapping, secondName, secondMapping, thirdName, thirdMapping, firstJoin, secondJoin) {
        this.firstName = firstName
        this.firstMapping = firstMapping
        this.secondName = secondName
        this.secondMapping = secondMapping
        this.thirdName = thirdName
        this.thirdMapping = thirdMapping

        this.firstJoin = firstJoin
        this.secondJoin = secondJoin

        this.generateSelectFromJoin = select => generateSelectStatement({ select, from: this.firstName, joins: [ this.firstJoin, this.secondJoin ] })
    }

    #createColumns() {
        const firstColumns = createColumnsFromMapping (0, this.firstMapping)
        const secondColumns = createColumnsFromMapping (1, this.secondMapping)
        const thirdColumns = createColumnsFromMapping (2, this.thirdMapping)

        return [firstColumns, secondColumns, thirdColumns]
    }

    innerJoin(otherTable, f) {
        const [firstColumns, secondColumns, thirdColumns] = this.#createColumns()
        const fourthColumns = createColumnsFromMapping(3, otherTable.mapping)

        const predicate = f(firstColumns, secondColumns, thirdColumns, fourthColumns)
        const thirdJoin = createJoin(3, otherTable.name, predicate)

        return new FourTables(
            this.firstName,
            this.firstMapping,
            this.secondName,
            this.secondMapping,
            this.thirdName,
            this.thirdMapping,
            otherTable.name,
            otherTable.mapping,
            this.firstJoin,
            this.secondJoin,
            thirdJoin)
    }

    filter(f) {
        const [firstColumns, secondColumns, thirdColumns] = this.#createColumns()

        return new ThreeFilteredTables(
            this.firstName, this.firstMapping,
            this.secondName, this.secondMapping,
            this.thirdName, this.thirdMapping,
            this.firstJoin, this.secondJoin,
            f(firstColumns, secondColumns, thirdColumns))
    }

    #query(f) {
        const [firstColumns, secondColumns, thirdColumns] = this.#createColumns()

        return createQuery(this.generateSelectFromJoin(f(firstColumns, secondColumns, thirdColumns)))
    }

    map(f) {
        return this.#query(f)
    }

    get(f) {
        return this.#query(f)
    }
}