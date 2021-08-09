import {
    concat,
    excludeNull,
    flattenObject,
    hasProperty,
    isNumber,
    joinWithCommaSpace,
    joinWithSpace,
    mapEntries,
    mapValues,
    surroundWithDoubleQuotes,
    unzip
} from 'standard-functions'
import generateColumnExpression from '../generate-column-expression'
import combineFragments from './combine-fragments'
import {generateJoins} from '../generate-joins'
import {generateWhere} from '../generate-where'
import {generateFrom} from '../generate-from'
import {generateValue} from '../generate-value'

/*
    someProperty: { tableIndex: 0, column: 'some_column', kind: 'column' }

    [ 'someProperty', { tableIndex: 0, column: 'some_column', kind: 'column' } ]

    [ { tableIndex: 0, column: 'some_column', kind: 'column' }, 'someProperty' ]

    [ 't1.some_column', 'someProperty' ]

    [ 't1.some_column', 'AS', 'someProperty' ]
 */
function generateColumnAlias(useTableAlias) {
    return ([alias, column]) => {
        const [columnSql, parameters] = generateColumnExpression(useTableAlias) (column)

        const aliasedSql = joinWithSpace(columnSql, 'AS', surroundWithDoubleQuotes(alias))

        return [aliasedSql, parameters]
    }
}

function generateMap(useColumnAlias) {
    return obj => {
        const columns = flattenObject(obj, hasProperty('kind'))

        const generate = useColumnAlias ? generateColumnAlias(true) : ([_, column]) => generateColumnExpression(true) (column)

        const mappedEntries = mapEntries(generate) (columns)

        const [columnSql, parameters] = unzip(mappedEntries)

        const joinedSql = joinWithCommaSpace(columnSql)
        const concatenatedParameters = concat(parameters)

        return [joinedSql, concatenatedParameters]

    }
}

function generateGet(column) {
    return generateColumnExpression(true) (column)
}

function generateSelectColumns(useColumnAlias) {
    return select => {
        if (select === '*' || select === 'COUNT(*)') {
            return [select, []]
        }
        else if (select.kind === 'column' || select.kind === 'is null' || select.kind === 'is not null') {
            return generateGet(select)
        }
        else {
            const withObjectifiedConstants = mapValues(value => {
                if (isNumber(value)) {
                    return {
                        kind: 'value',
                        value
                    }
                } else {
                    return value
                }
            })(select)

            return generateMap(useColumnAlias) (withObjectifiedConstants)
        }
    }
}

function generateSelect(useColumnAlias) {
    return select => {
        const [columnsSql, parameters] = generateSelectColumns(useColumnAlias) (select)
        return [`SELECT ${columnsSql}`, parameters]
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

function generateGroupBy(expr) {
    const [sql, parameters] = generateColumnExpression(true) (expr)
    return [`GROUP BY ${sql}`, parameters]
}

function generateLimit(n) {
    const [sql, parameters] = generateValue(n)

    return [`LIMIT ${sql}`, parameters]
}

function generateOffset(n) {
    const [sql, parameters] = generateValue(n)

    return [`OFFSET ${sql}`, parameters]
}

export function generateSelectStatement(useColumnAlias) {
    const fragmentGenerators = {
        select: generateSelect(useColumnAlias),
        from: generateFrom(true),
        joins: generateJoins,
        where: generateWhere(true),
        groupBy: generateGroupBy,
        orderBy: generateOrderBy,
        limit: generateLimit,
        offset: generateOffset
    }

    return input => {
        const withoutNullValues = excludeNull(input)

        const fragments = mapEntries(([key, value]) =>
            fragmentGenerators[key](value)
        ) (withoutNullValues)

        const combined = combineFragments(fragments)

        return combined
    }
}