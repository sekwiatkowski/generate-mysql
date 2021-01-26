import {
    concat,
    filter,
    flatten,
    flattenObject,
    hasProperty,
    isArray,
    joinWithCommaSpace,
    joinWithNewline,
    joinWithSpace,
    keys,
    map,
    mapEntries,
    pick, propertyOf,
    surroundWithDoubleQuotes, unzip
} from 'standard-functions'
import {generateTableExpression} from './generate-table'
import generateColumnExpression from './generate-column-expression'
import {generateRootBooleanExpression} from './generate-boolean-expression'

/*
    someProperty: { tableIndex: 0, column: 'some_column', kind: 'column' }

    [ 'someProperty', { tableIndex: 0, column: 'some_column', kind: 'column' } ]

    [ { tableIndex: 0, column: 'some_column', kind: 'column' }, 'someProperty' ]

    [ 't1.some_column', 'someProperty' ]

    [ 't1.some_column', 'AS', 'someProperty' ]
 */
function generateColumnAlias([alias, column]) {
    const [columnSql, parameters] = generateColumnExpression(true) (column)

    const aliasedSql = joinWithSpace(columnSql, 'AS', surroundWithDoubleQuotes(alias))

    return [aliasedSql, parameters]
}

function generateMap(obj) {
    const columns = flattenObject(obj, hasProperty('kind'))

    const [columnSql, parameters] = unzip(mapEntries(generateColumnAlias) (columns))

    const joinedSql = joinWithCommaSpace(columnSql)
    const concatenatedParameters = concat(parameters)

    return [joinedSql, concatenatedParameters]
}

function generateGet(column) {
    return generateColumnExpression(true) (column)
}

function generateSelectColumns(select) {
    if (select === '*' || select === 'COUNT(*)') {
        return [select, []]
    }
    else if(select.kind === 'column' || select.kind === 'is null' || select.kind === 'is not null') {
        return generateGet(select)
    }
    else {
        return generateMap(select)
    }
}

function generateSelect(select) {
    const [columnsSql, parameters] = generateSelectColumns(select)
    return [ `SELECT ${columnsSql}`, parameters]
}

function generateFrom(from) {
    return `FROM ${generateTableExpression(from, 0)}`
}

export function generateWhere(useAlias) {
    return predicate => {
        const [sql, parameters] = generateRootBooleanExpression(useAlias) (predicate)
        return [`WHERE ${sql}`, parameters]
    }
}

function generateSortExpression(sort) {
    const [columnSql, parameters] = generateColumnExpression(true) (sort.expression)
    return [`${columnSql} ${sort.direction}`, parameters]
}

function generateOrderBy(expr) {
    const [sortSql, parameters] = generateSortExpression(expr)
    return [`ORDER BY ${sortSql}`, parameters]
}

const queryGenerators = {
    select: generateSelect,
    from: generateFrom,
    joins: generateJoins,
    where: generateWhere(true),
    orderBy: generateOrderBy
}
const queryFragments = keys(queryGenerators)

function generateJoin({ otherTable, predicate }) {
    const [comparisonSql, parameters] = generateRootBooleanExpression(true) (predicate)

    const sqlFragments = [
        'INNER JOIN',
        generateTableExpression(otherTable.name, otherTable.index),
        'ON',
        comparisonSql
    ]

    const sql = joinWithSpace(sqlFragments)

    return [sql, parameters]
}

function generateJoins(joins) {
    const pairs = map(generateJoin)(joins)

    const [ sqlFragments, parameterLists ] = unzip(pairs)

    const parameters = flatten(parameterLists)

    return [ joinWithNewline(sqlFragments), parameters ]
}

function generateQueryFragments(query) {
    const presentFragments = filter(propertyOf(query)) (queryFragments)

    const relevantGenerators = pick(presentFragments) (queryGenerators)

    const fragments = mapEntries(([fragment, generate]) =>
        generate(query[fragment])
    )(relevantGenerators)

    return fragments
}

export function generateQuery(query) {
    const fragments = generateQueryFragments(query)

    const ensuredPairs = map(stringOrArray => isArray(stringOrArray)
        ? stringOrArray
        : [stringOrArray, []]
    ) (fragments)

    const [sqlFragments, parameterFragments] = unzip(ensuredPairs)

    const sql = joinWithNewline(sqlFragments)
    const parameters = flatten(parameterFragments)

    return [sql, parameters]
}