import {isArray, mapFirst} from 'compose-functions'

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

export function createQuery(generateSql) {
    return {
        kind: 'query',
        generate: () => generateSql(),
        limit: n => createLimitedQuery(generateSql, n),
        offset: n => createOffsetQuery(generateSql, n)
    }
}

export function createLimitedQuery(generateSql, limit) {
    return {
        kind: 'limited-query',
        generate: () => addToQuery(generateSql()) (addLimit(limit)),
        offset: n => createLimitedOffsetQuery(generateSql, limit, n)
    }
}

export function createLimitedOffsetQuery(generateSql, limit, offset) {
    return {
        kind: 'limited-query',
        generate: () => addToQuery(generateSql()) (addLimitAndOffset(limit) (offset))
    }
}

export function createOffsetQuery(generateSql, offset) {
    return {
        kind: 'offset-query',
        generate: () => addToQuery(generateSql()) (addOffset(offset)),
        offset
    }
}