import {generateSelectStatement} from './generation/statements/generate-select-statement'

function addOffset(offset) {
    return statement => ({
        ...statement,
        offset
    })
}

function addLimit(limit) {
    return statement => ({
        ...statement,
        limit
    })
}

export function createQuery(statement) {
    return {
        kind: 'query',
        statement,
        generate: (useColumnAlias = true) => generateSelectStatement(useColumnAlias) (statement),
        limit: n => createLimitedQuery(statement, n),
        offset: n => createOffsetQuery(statement, n)
    }
}

function createLimitedQuery(statement, limit) {
    const limitedStatement = addLimit(limit) (statement)

    return {
        kind: 'limited-query',
        statement: limitedStatement,
        generate: (useColumnAlias = true) => generateSelectStatement(useColumnAlias) (limitedStatement),
        offset: offset => createLimitedOffsetQuery(statement, limit, offset)
    }
}

function createOffsetQuery(statement, offset) {
    const offsetStatement = addOffset(offset) (statement)

    return {
        kind: 'offset-query',
        statement,
        generate: (useColumnAlias = true) => generateSelectStatement(useColumnAlias) (offsetStatement),
        limit: limit => createLimitedOffsetQuery(statement, limit, offset)
    }
}

function createLimitedOffsetQuery(statement, limit, offset) {
    return {
        kind: 'limited-offset-query',
        statement,
        generate: (useColumnAlias = true) => generateSelectStatement(useColumnAlias) (addOffset(offset) (addLimit(limit) (statement)))
    }
}

export function createCountQuery(select) {
    return {
        kind: 'count-query',
        generate: (useColumnAlias = true) => generateSelectStatement(useColumnAlias) (select('COUNT(*)'))
    }
}