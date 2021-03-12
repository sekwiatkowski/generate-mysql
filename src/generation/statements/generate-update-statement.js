import {
    concat,
    filter,
    flatten, isArray,
    isNotNull,
    joinWithCommaSpace, map,
    mapEntries,
    mapKeys,
    propertyOf,
    unzip
} from 'standard-functions'
import {generateEquality} from '../boolean/generate-comparison'
import {createColumn} from '../../expressions/column'
import {generateTableAccess} from '../access/generate-table-access'
import combineFragments from './combine-fragments'
import {generateJoins} from '../generate-joins'
import {generateWhere} from '../generate-where'

function generateUpdateTable(tableName) {
    return [`UPDATE ${generateTableAccess(tableName, 0)}`, []]
}

function generateAssignment(tableIndex) {
    return ([ columnName, value ]) => {

        const column = createColumn(tableIndex) (columnName)

        return generateEquality(true)({left: column, right: value})
    }
}

function generateAssignmentList(mapping, tableIndex, assignment) {
    const partialRow = mapKeys(propertyOf(mapping)) (assignment)

    const [ generatedAssignments, parameters ] = unzip(mapEntries(generateAssignment(tableIndex)) (partialRow))

    const assignmentSql = joinWithCommaSpace(generatedAssignments)

    return [assignmentSql, flatten(parameters)]
}

function generateSet(mappings, set) {
    const assignmentFragments = map(({ tableIndex, assignment }) =>
        generateAssignmentList(mappings[tableIndex], tableIndex, assignment)
    ) (isArray(set) ? set : [set])
    const [assignmentSqlFragments, assignmentParameterLists] = unzip(assignmentFragments)
    const setSql = `SET ${joinWithCommaSpace(assignmentSqlFragments)}`
    const setParameters = concat(assignmentParameterLists)

    return [setSql, setParameters]
}

export function generateUpdateStatement({ firstTableName, joins, where, mappings, set }) {
    const updateTableFragment = generateUpdateTable(firstTableName)

    const joinFragment = joins ? generateJoins(joins) : null

    const setFragment = generateSet(mappings, set)

    const whereFragment = generateWhere(true) (where)

    const fragments = [ updateTableFragment, joinFragment, setFragment, whereFragment ]

    const presentFragments = filter(isNotNull) (fragments)

    return combineFragments(presentFragments)
}