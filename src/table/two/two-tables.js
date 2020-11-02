import {mapValues} from 'compose-functions'
import {createComparisonExpression} from '../../expressions/comparison-expression'
import createJoin from '../../expressions/join'
import {TwoFilteredTables} from './two-filtered-tables'
import {generateQuery} from '../../generation/generate-query'
import {ThreeTables} from '../three/three-tables'
import createGetExpression from '../../expressions/get-expression'
import createMapExpression from '../../expressions/map-expression'
import {createQuery} from '../../query'

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
            joins: [ this.firstJoin, this.secondJoin ]
        })
    }

    innerJoin(otherTable, f) {
        const firstComparisonExpressions = mapValues(createComparisonExpression(0))(this.firstMapping)
        const secondComparisonExpressions = mapValues(createComparisonExpression(1))(this.secondMapping)
        const thirdComparisonExpressions = mapValues(createComparisonExpression(2))(otherTable.mapping)

        const comparison = f(firstComparisonExpressions, secondComparisonExpressions, thirdComparisonExpressions)
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
        const firstComparisonExpressions = mapValues(createComparisonExpression(0))(this.firstMapping)
        const secondComparisonExpressions = mapValues(createComparisonExpression(1))(this.secondMapping)

        return new TwoFilteredTables(
            this.firstName, this.firstMapping,
            this.secondName, this.secondMapping,
            this.firstJoin,
            f(firstComparisonExpressions, secondComparisonExpressions))
    }

    map(f) {
        const firstExpressions = mapValues(createMapExpression(0))(this.firstMapping)
        const secondExpressions = mapValues(createMapExpression(1))(this.secondMapping)

        return createQuery(() => this.generateSelectFromJoins(f(firstExpressions, secondExpressions)))
    }

    get(f) {
        const firstExpressions = mapValues(createGetExpression(0))(this.firstMapping)
        const secondExpressions = mapValues(createGetExpression(1))(this.secondMapping)

        return createQuery(() => this.generateSelectFromJoins(f(firstExpressions, secondExpressions)))
    }
}