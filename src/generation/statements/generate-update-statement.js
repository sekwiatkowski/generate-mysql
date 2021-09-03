import {
    concat,
    filter,
    flatten,
    isArray,
    isNotNull,
    joinWithCommaSpace,
    map,
    mapEntries,
    unzip
} from 'standard-functions'
import {generateTableAccess} from '../access/generate-table-access'
import combineFragments from './combine-fragments'
import {generateJoins} from '../generate-joins'
import {generateWhere} from '../generate-where'
import generateExpression from '../generate-expression'

function generateUpdateTable(tableName) {
    return [`UPDATE ${generateTableAccess(tableName, 0)}`, []]
}

export function generateAssignment({left, right}) {
    const [leftSql, leftParameters] = generateExpression(true) (left)
    const [rightSql, rightParameters] = generateExpression(true) (right)
    return [`${leftSql} = ${rightSql}`, concat(leftParameters, rightParameters)]
}

function generateAssignmentList({ columns, assignment }) {
    const items = mapEntries(([ property, expression ]) =>
        generateAssignment({
            left: columns[property],
            right: expression
        })
    ) (assignment)

    const [ generatedAssignments, parameters ] = unzip(items)

    const assignmentSql = joinWithCommaSpace(generatedAssignments)

    return [assignmentSql, flatten(parameters)]
}

function generateSet(arr) {
    const assignmentFragments = map(generateAssignmentList) (arr)

    const [assignmentSqlFragments, assignmentParameterLists] = unzip(assignmentFragments)

    const setSql = `SET ${joinWithCommaSpace(assignmentSqlFragments)}`
    const setParameters = concat(assignmentParameterLists)

    return [setSql, setParameters]
}

export function generateUpdateStatement({ firstTableName, joins, where, set }) {
    const updateTableFragment = generateUpdateTable(firstTableName)

    const joinFragment = joins ? generateJoins(joins) : null

    const setFragment = generateSet(isArray(set) ? set : [ set ])

    const whereFragment = generateWhere(true) (where)

    const fragments = [ updateTableFragment, joinFragment, setFragment, whereFragment ]

    const presentFragments = filter(isNotNull) (fragments)

    return combineFragments(presentFragments)
}