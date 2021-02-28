import createJoin from '../../expressions/join'
import {TwoFilteredTables} from './two-filtered-tables'
import {generateSelectStatement} from '../../generation/statements/generate-select-statement'
import {ThreeTables} from '../three/three-tables'
import {createQuery} from '../../query'
import {createColumnsFromMapping} from '../../expressions/column'

export class TwoTables {
    firstName
    firstMapping
    secondName
    secondMapping

    firstJoin

    generateSelectFromJoins

    constructor(firstName, firstMapping, secondName, secondMapping, firstJoin) {
        this.firstName = firstName
        this.firstMapping = firstMapping
        this.secondName = secondName
        this.secondMapping = secondMapping

        this.firstJoin = firstJoin

        this.generateSelectFromJoins = select => generateSelectStatement({
            select,
            from: this.firstName,
            joins: [ this.firstJoin ]
        })
    }

    #createColumns() {
        const firstColumns = createColumnsFromMapping (0, this.firstMapping)
        const secondColumns = createColumnsFromMapping (1, this.secondMapping)

        return [firstColumns, secondColumns]
    }

    innerJoin(otherTable, f) {
        const [firstColumns, secondColumns] = this.#createColumns()
        const thirdColumns = createColumnsFromMapping(2, otherTable.mapping)

        const predicate = f(firstColumns, secondColumns, thirdColumns)
        const secondJoin = createJoin(2, otherTable.name, predicate)

        return new ThreeTables(
            this.firstName,
            this.firstMapping,
            this.secondName,
            this.secondMapping,
            otherTable.name,
            otherTable.mapping,
            this.firstJoin,
            secondJoin)
    }

    filter(f) {
        const firstColumns = createColumnsFromMapping(0, this.firstMapping)
        const secondColumns = createColumnsFromMapping(1, this.secondMapping)

        return new TwoFilteredTables(
            this.firstName, this.firstMapping,
            this.secondName, this.secondMapping,
            this.firstJoin,
            f(firstColumns, secondColumns))
    }

    #query(f) {
        const [firstColumns, secondColumns] = this.#createColumns()

        return createQuery(this.generateSelectFromJoins(f(firstColumns, secondColumns)))
    }

    map(f) {
        return this.#query(f)
    }

    get(f) {
        return this.#query(f)
    }
}