import {
    concat,
    filter,
    flattenObject,
    hasProperty,
    joinWithCommaSpace,
    joinWithSpace,
    keys,
    mapEntries,
    pick,
    propertyOf,
    surroundWithDoubleQuotes,
    unzip
} from 'standard-functions'
import generateColumnExpression from '../generate-column-expression'
import combineFragments from './combine-fragments'
import {generateJoins} from '../generate-joins'
import {generateWhere} from '../generate-where'
import {generateFrom} from '../generate-from'

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

function generateSortExpression(sort) {
    const [columnSql, parameters] = generateColumnExpression(true) (sort.expression)
    return [`${columnSql} ${sort.direction}`, parameters]
}

function generateOrderBy(expr) {
    const [sortSql, parameters] = generateSortExpression(expr)
    return [`ORDER BY ${sortSql}`, parameters]
}

function generateGroupBy(expr) {
    const [sql, parameters] = generateColumnExpression(true) (expr)
    return [`GROUP BY ${sql}`, parameters]
}

const queryGenerators = {
    select: generateSelect,
    from: generateFrom(true),
    joins: generateJoins,
    where: generateWhere(true),
    orderBy: generateOrderBy,
    groupBy: generateGroupBy
}
const queryFragments = keys(queryGenerators)

function generateQueryFragments(query) {
    const presentFragments = filter(propertyOf(query)) (queryFragments)

    const relevantGenerators = pick(presentFragments) (queryGenerators)

    const fragments = mapEntries(([fragment, generate]) =>
        generate(query[fragment])
    ) (relevantGenerators)

    return fragments
}

export function generateSelectStatement(input) {
    const fragments = generateQueryFragments(input)

    return combineFragments(fragments)
}