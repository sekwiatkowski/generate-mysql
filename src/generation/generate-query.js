import {
    applyPairTo,
    compose,
    concatOptions,
    flatten,
    flattenObject,
    flipPair,
    foldPair, hasProperty,
    invertPairs,
    isFunction,
    isString,
    joinWithCommaSpace,
    joinWithNewline,
    joinWithSpace,
    map,
    mapEntries,
    mapOption,
    mapSecond,
    mapValues,
    maybeUndefined,
    onlyIf,
    pairWith,
    safePropertyOf,
    some,
    surroundWithDoubleQuotes
} from 'compose-functions'
import {generateTableExpression} from './generate-table'
import generateColumn from './generate-column'
import generateComparison from './generate-comparison'

/*
    someProperty: { tableIndex: 0, column: 'some_column', kind: 'column' }

    [ 'someProperty', { tableIndex: 0, column: 'some_column', kind: 'column' } ]

    [ { tableIndex: 0, column: 'some_column', kind: 'column' }, 'someProperty' ]

    [ 't1.some_column', 'someProperty' ]

    [ 't1.some_column', 'AS', 'someProperty' ]
 */
function generateColumnAlias([alias, column]) {
    return joinWithSpace([
        generateColumn(column),
        'AS',
        surroundWithDoubleQuotes(alias)
    ])
}

function generateMap(obj) {
    const columns = flattenObject(obj, hasProperty('kind'))

    const aliases = mapEntries(generateColumnAlias) (columns)

    return joinWithCommaSpace(aliases)
}

function generateGet(column) {
    return generateColumn(column)
}

function generateSelectColumns(select) {
    if (select === '*') {
        return '*'
    }
    else if(select.kind === 'column') {
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

function generateWhere(comparison) {
    const [sql, parameters] = generateComparison(comparison)
    return [`WHERE ${sql}`, parameters]
}

function generateSortExpression(expr) {
    const column = generateColumn(expr)
    return `${column} ${expr.direction}`
}

function generateOrderBy(expr) {
    return `ORDER BY ${generateSortExpression(expr)}`
}

const queryGenerators = [
    [generateSelect, 'select'],
    [generateFrom, 'from'],
    [generateJoins, 'joins'],
    [generateWhere, 'where'],
    [generateOrderBy, 'orderBy']
]

function generateJoin({ otherTable, comparison }) {
    const [comparisonSql, parameters] = generateComparison(comparison)

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

    const [ sqlFragments, parameterLists ] = invertPairs(pairs)

    const parameters = flatten(parameterLists)

    return [ joinWithNewline(sqlFragments), parameters ]
}

function generateQueryFragments(query) {
    /* [ [ generateSelect, some(select) ],
         [ generateFrom, some(from) ],
         [ generateWhere, maybe([where, parameters]) ]  */
    const withInput = map(mapSecond(safePropertyOf(query))) (queryGenerators)

    /* [ some('SELECT ...'])
         some('FROM ...'])
         maybe([['WHERE ...', parameters]) ] */
    const generated = map(foldPair(mapOption)) (withInput)

    /* [ 'SELECT ...',
         'FROM ...',
         ['WHERE ...', parameters] ] */
    const fragments = concatOptions(generated)

    return fragments
}

const ensurePair = onlyIf (isString) (pairWith([]))

export function generateParameterlessQuery({ select, from, orderBy }) {
    const selectSql = some(generateSelect(select))
    const fromSql = some(generateFrom(from))
    const orderBySql = mapOption(generateOrderBy)(maybeUndefined(orderBy))

    return joinWithNewline(concatOptions([selectSql, fromSql, orderBySql]))
}

export function generateQuery(query) {
    const fragments = generateQueryFragments(query)

    const ensuredPairs = map(ensurePair)(fragments)

    const [sqlFragments, parameterFragments] = invertPairs(ensuredPairs)

    const sql = joinWithNewline(sqlFragments)
    const parameters = flatten(parameterFragments)

    return [sql, parameters]
}