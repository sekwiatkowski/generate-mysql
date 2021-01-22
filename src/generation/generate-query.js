import {
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
    pick,
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
    return joinWithSpace(
        generateColumnExpression(column),
        'AS',
        surroundWithDoubleQuotes(alias)
    )
}

function generateMap(obj) {
    const columns = flattenObject(obj, hasProperty('kind'))

    const aliases = mapEntries(generateColumnAlias) (columns)

    return joinWithCommaSpace(aliases)
}

function generateGet(column) {
    return generateColumnExpression(column)
}

function generateSelectColumns(select) {
    if (select === '*' || select === 'COUNT(*)') {
        return select
    }
    else if(select.kind === 'column' || select.kind === 'is null' || select.kind === 'is not null') {
        return generateGet(select)
    }
    else {
        return generateMap(select)
    }
}

function generateSelect(select) {
    return `SELECT ${generateSelectColumns(select)}`
}

function generateFrom(from) {
    return `FROM ${generateTableExpression(from, 0)}`
}

function generateWhere(predicate) {
    const [sql, parameters] = generateRootBooleanExpression(predicate)
    return [`WHERE ${sql}`, parameters]
}

function generateSortExpression(sort) {
    const column = generateColumnExpression(sort.expression)
    return `${column} ${sort.direction}`
}

function generateOrderBy(expr) {
    return `ORDER BY ${generateSortExpression(expr)}`
}

const queryGenerators = {
    select: generateSelect,
    from: generateFrom,
    joins: generateJoins,
    where: generateWhere,
    orderBy: generateOrderBy
}
const queryFragments = keys(queryGenerators)

function generateJoin({ otherTable, predicate }) {
    const [comparisonSql, parameters] = generateRootBooleanExpression(predicate)

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
    const presentFragments = filter(fragment => query[fragment])(queryFragments)

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