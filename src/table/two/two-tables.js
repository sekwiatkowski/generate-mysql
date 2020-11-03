import {mapValues} from 'compose-functions'
import {createComparisonExpression} from '../../expressions/predicate'
import createJoin from '../../expressions/join'
import {TwoFilteredTables} from './two-filtered-tables'
import {generateQuery} from '../../generation/generate-query'
import {ThreeTables} from '../three/three-tables'
import {createQuery} from '../../query'
import {createColumn, createColumnsFromMapping} from '../../expressions/column'

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

        this.generateSelectFromJoins = select => generateQuery({
            select,
            from: this.firstName,
            joins: [ this.firstJoin ]
        })
    }

    innerJoin(otherTable, f) {
        const firstPredicates = mapValues(createComparisonExpression(0))(this.firstMapping)
        const secondPredicates = mapValues(createComparisonExpression(1))(this.secondMapping)
        const thirdPredicates = mapValues(createComparisonExpression(2))(otherTable.mapping)

        const comparison = f(firstPredicates, secondPredicates, thirdPredicates)
        const secondJoin = createJoin(2, otherTable.name, comparison)

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
        const firstPredicates = mapValues(createComparisonExpression(0))(this.firstMapping)
        const secondPredicates = mapValues(createComparisonExpression(1))(this.secondMapping)

        return new TwoFilteredTables(
            this.firstName, this.firstMapping,
            this.secondName, this.secondMapping,
            this.firstJoin,
            f(firstPredicates, secondPredicates))
    }

    map(f) {
        const firstColumns = createColumnsFromMapping (0, this.firstMapping)
        const secondColumns = createColumnsFromMapping (1, this.secondMapping)

        return createQuery(this.generateSelectFromJoins(f(firstColumns, secondColumns)))
    }

    get(f) {
        const firstColumns = createColumnsFromMapping (0, this.firstMapping)
        const secondColumns = createColumnsFromMapping (1, this.secondMapping)

        return createQuery(this.generateSelectFromJoins(f(firstColumns, secondColumns)))
    }
}