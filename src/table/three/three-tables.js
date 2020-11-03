import {generateQuery} from '../../generation/generate-query'
import {createPredicateBuildersFromMapping} from '../../expressions/predicate'
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
        const firstPredicates = createPredicateBuildersFromMapping(0, this.firstMapping)
        const secondPredicates = createPredicateBuildersFromMapping(1, this.secondMapping)
        const thirdPredicates = createPredicateBuildersFromMapping(2, this.thirdMapping)

        return new ThreeFilteredTables(
            this.firstName, this.firstMapping,
            this.secondName, this.secondMapping,
            this.thirdName, this.thirdMapping,
            this.firstJoin, this.secondJoin,
            f(firstPredicates, secondPredicates, thirdPredicates))
    }

    map(f) {
        const firstColumns = createColumnsFromMapping(0, this.firstMapping)
        const secondColumns = createColumnsFromMapping(1, this.secondMapping)
        const thirdColumns = createColumnsFromMapping(2, this.thirdMapping)

        return createQuery(this.generateSelectFromJoin(f(firstColumns, secondColumns, thirdColumns)))
    }

    get(f) {
        const firstColumns = createColumnsFromMapping(0, this.firstMapping)
        const secondColumns = createColumnsFromMapping(1, this.secondMapping)
        const thirdColumns = createColumnsFromMapping(2, this.thirdMapping)

        return createQuery(this.generateSelectFromJoin(f(firstColumns, secondColumns, thirdColumns)))
    }

}