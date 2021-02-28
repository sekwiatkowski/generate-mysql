import {generateSelectStatement} from '../../generation/statements/generate-select-statement'
import {createCountQuery, createQuery} from '../../query'
import {createColumnsFromMapping} from '../../expressions/column'
import {generateUpdateStatement} from '../../generation/statements/generate-update-statement'

export class ThreeFilteredTables {
    firstName
    firstMapping
    secondName
    secondMapping
    thirdName
    thirdMapping

    firstJoin

    where

    generateSelectFromJoinsWhere

    constructor(firstName, firstMapping, secondName, secondMapping, thirdName, thirdMapping, firstJoin, secondJoin, where) {
        this.firstName = firstName
        this.firstMapping = firstMapping
        this.secondName = secondName
        this.secondMapping = secondMapping
        this.thirdName = thirdName
        this.thirdMapping = thirdMapping

        this.firstJoin = firstJoin
        this.secondJoin = secondJoin

        this.where = where

        this.generateSelectFromJoinsWhere = select => generateSelectStatement({
            select,
            from: this.firstName,
            joins: [ this.firstJoin, this.secondJoin ],
            where: this.where
        })
    }

    #createColumns() {
        const firstColumns = createColumnsFromMapping (0, this.firstMapping)
        const secondColumns = createColumnsFromMapping (1, this.secondMapping)
        const thirdColumns = createColumnsFromMapping (2, this.thirdMapping)

        return [firstColumns, secondColumns, thirdColumns]
    }

    #query(f) {
        const [firstColumns, secondColumns, thirdColumns] = this.#createColumns()

        return createQuery(this.generateSelectFromJoinsWhere(f(firstColumns, secondColumns, thirdColumns)))
    }

    map(f) {
        return this.#query(f)
    }

    get(f) {
        return this.#query(f)
    }

    count() {
        return createCountQuery(this.generateSelectFromJoinsWhere)
    }

    update(f) {
        return generateUpdateStatement({
            tableNames: [this.firstName, this.secondName, this.thirdName],
            mappings: [this.firstMapping, this.secondMapping, this.thirdMapping],
            joins: [this.firstJoin, this.secondJoin],
            where: this.where,
            set: f(0, 1, 2)
        })
    }
}