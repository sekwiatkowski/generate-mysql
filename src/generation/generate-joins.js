import {generateRootBooleanExpression} from './boolean/generate-boolean-expression'
import {generateTableAccess} from './access/generate-table-access'
import {flatten, joinWithNewline, joinWithSpace, map, unzip} from 'standard-functions'

function generateJoin({otherTable, predicate}) {
    const [comparisonSql, parameters] = generateRootBooleanExpression(true)(predicate)

    const sqlFragments = [
        'INNER JOIN',
        generateTableAccess(otherTable.name, otherTable.index),
        'ON',
        comparisonSql
    ]

    const sql = joinWithSpace(sqlFragments)

    return [sql, parameters]
}

export function generateJoins(joins) {
    const pairs = map(generateJoin)(joins)

    const [sqlFragments, parameterLists] = unzip(pairs)

    const parameters = flatten(parameterLists)

    return [joinWithNewline(sqlFragments), parameters]
}