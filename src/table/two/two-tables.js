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

    innerJoin(otherTable, f) {
        const firstPredicates = createColumnsFromMapping(0, this.firstMapping)
        const secondPredicates = createColumnsFromMapping(1, this.secondMapping)
        const thirdPredicates = createColumnsFromMapping(2, otherTable.mapping)

        const predicate = f(firstPredicates, secondPredicates, thirdPredicates)
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
        const firstPredicates = createColumnsFromMapping(0, this.firstMapping)
        const secondPredicates = createColumnsFromMapping(1, this.secondMapping)

        return new TwoFilteredTables(
            this.firstName, this.firstMapping,
            this.secondName, this.secondMapping,
            this.firstJoin,
            f(firstPredicates, secondPredicates))
    }

    map(f) {
        const firstColumns = createColumnsFromMapping(0, this.firstMapping)
        const secondColumns = createColumnsFromMapping(1, this.secondMapping)

        return createQuery(this.generateSelectFromJoins(f(firstColumns, secondColumns)))
    }

    get(f) {
        const firstColumns = createColumnsFromMapping(0, this.firstMapping)
        const secondColumns = createColumnsFromMapping(1, this.secondMapping)

        return createQuery(this.generateSelectFromJoins(f(firstColumns, secondColumns)))
    }
}