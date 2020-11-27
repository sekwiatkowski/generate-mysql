import {isArray, mapFirst} from 'standard-functions'

function addToQuery(stringOrArray) {
    return addToSql => isArray(stringOrArray)
        ? mapFirst(addToSql)(stringOrArray)
        : addToSql(stringOrArray)
}

function addLimit(limit) {
    return sql => sql + '\n' + `LIMIT ${limit}`
}

function addOffset(offset) {
    return sql => sql + '\n' + `OFFSET ${offset}`
}

function addLimitAndOffset(limit) {
    return offset => sql => {
        const addedLimit = addLimit(limit) (sql)

        return addOffset(offset) (addedLimit)
    }
}

export function createQuery(statement) {
    return {
        kind: 'query',
        generate: () => statement,
        limit: n => createLimitedQuery(statement, n),
        offset: n => createOffsetQuery(statement, n)
    }
}

export function createLimitedQuery(statement, limit) {
    return {
        kind: 'limited-query',
        generate: () => addToQuery(statement) (addLimit(limit)),
        offset: n => createLimitedOffsetQuery(statement, limit, n)
    }
}

export function createLimitedOffsetQuery(statement, limit, offset) {
    return {
        kind: 'limited-query',
        generate: () => addToQuery(statement) (addLimitAndOffset(limit) (offset))
    }
}

export function createOffsetQuery(statement, offset) {
    return {
        kind: 'offset-query',
        generate: () => addToQuery(statement) (addOffset(offset)),
        offset
    }
}