import {mapValues} from 'compose-functions'
import {generateQuery} from '../../generation/generate-query'
import {createComparisonExpression} from '../../expressions/predicate'
import {ThreeFilteredTables} from './three-filtered-tables'
import {createQuery} from '../../query'
import {createColumnsFromMapping} from '../../expressions/column'

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

        this.generateSelectFromJoin = select => generateQuery({ select, from: this.firstName, joins: [ this.firstJoin, this.secondJoin ] })
    }

    filter(f) {
        const firstComparisonExpressions = mapValues(createComparisonExpression(0))(this.firstMapping)
        const secondComparisonExpressions = mapValues(createComparisonExpression(1))(this.secondMapping)
        const thirdComparisonExpressions = mapValues(createComparisonExpression(2))(this.thirdMapping)

        return new ThreeFilteredTables(
            this.firstName, this.firstMapping,
            this.secondName, this.secondMapping,
            this.thirdName, this.thirdMapping,
            this.firstJoin, this.secondJoin,
            f(firstComparisonExpressions, secondComparisonExpressions, thirdComparisonExpressions))
    }

    map(f) {
        const firstExpressions = createColumnsFromMapping(0, this.firstMapping)
        const secondExpressions = createColumnsFromMapping(1, this.secondMapping)
        const thirdExpressions = createColumnsFromMapping(2, this.thirdMapping)

        return createQuery(this.generateSelectFromJoin(f(firstExpressions, secondExpressions, thirdExpressions)))
    }

    get(f) {
        const firstExpressions = createColumnsFromMapping(0, this.firstMapping)
        const secondExpressions = createColumnsFromMapping(1, this.secondMapping)
        const thirdExpressions = createColumnsFromMapping(2, this.thirdMapping)

        return createQuery(this.generateSelectFromJoin(f(firstExpressions, secondExpressions, thirdExpressions)))
    }

}