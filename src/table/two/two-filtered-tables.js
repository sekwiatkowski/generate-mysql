import {generateSelectStatement} from '../../generation/statements/generate-select-statement'
import {createCountQuery, createQuery} from '../../query'
import {createColumnsFromMapping} from '../../expressions/column'
import {generateUpdateStatement} from '../../generation/statements/generate-update-statement'

export class TwoFilteredTables {
    firstName
    firstMapping
    secondName
    secondMapping

    firstJoin

    where

    generateSelectFromJoinsWhere

    constructor(firstName, firstMapping, secondName, secondMapping, firstJoin, where) {
        this.firstName = firstName
        this.firstMapping = firstMapping
        this.secondName = secondName
        this.secondMapping = secondMapping

        this.firstJoin = firstJoin
        this.where = where

        this.generateSelectFromJoinsWhere = select => generateSelectStatement({
            select,
            from: this.firstName,
            joins: [ this.firstJoin ],
            where: this.where
        })
    }

    map(f) {
        const firstColumns = createColumnsFromMapping (0, this.firstMapping)
        const secondColumns = createColumnsFromMapping (1, this.secondMapping)

        return createQuery(this.generateSelectFromJoinsWhere(f(firstColumns, secondColumns)))
    }

    get(f) {
        const firstColumns = createColumnsFromMapping (0, this.firstMapping)
        const secondColumns = createColumnsFromMapping (1, this.secondMapping)

        return createQuery(this.generateSelectFromJoinsWhere(f(firstColumns, secondColumns)))
    }

    count() {
        return createCountQuery(this.generateSelectFromJoinsWhere)
    }

    update(f) {
        return generateUpdateStatement({
            tableNames: [this.firstName, this.secondName],
            mappings: [this.firstMapping, this.secondMapping],
            joins: [this.firstJoin],
            where: this.where,
            set: f(0, 1)
        })
    }
}