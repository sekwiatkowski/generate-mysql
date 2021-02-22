import {
    appendTo,
    concat, filter,
    flatten, fold, isNotNull,
    joinWithCommaSpace,
    joinWithNewline,
    mapEntries,
    mapKeys,
    propertyOf,
    unzip
} from 'standard-functions'
import {generateEquality} from './generate-comparison'
import {createColumn} from '../expressions/column'
import {generateJoins, generateWhere} from './generate-query'
import {generateTableExpression} from './generate-table'

function generateUpdateTable(tableName, tableIndex) {
    return [`UPDATE ${generateTableExpression(tableName, tableIndex)}`, []]
}

function generateAssignment(tableIndex) {
    return ([ columnName, value ]) => {

        const column = createColumn(tableIndex) (columnName)

        return generateEquality(true)({left: column, right: value})
    }
}

function generateSet(mapping, tableIndex, partialObject) {
    const partialRow = mapKeys(propertyOf(mapping)) (partialObject)

    const [ generatedAssignments, setParameters ] = unzip(mapEntries(generateAssignment(tableIndex)) (partialRow))

    const assignmentList = joinWithCommaSpace(generatedAssignments)
    const setSql = `SET ${assignmentList}`

    return [setSql, flatten(setParameters)]
}

export default function generateUpdate({ tableNames, mappings, joins, where, set }) {
    const { tableIndex, partialObject } = set

    const updateTableFragment = generateUpdateTable(tableNames[tableIndex], tableIndex)
    const joinFragment = joins ? generateJoins(joins) : null
    const setFragment = generateSet(mappings[tableIndex], tableIndex, partialObject)
    const whereFragment = generateWhere(true) (where)

    const fragments = [ updateTableFragment, joinFragment, setFragment, whereFragment ]

    const presentFragments = filter(isNotNull) (fragments)

    const [sqlArray, parameters ] = fold((acc, fragment) => {
        const [accSql, accParameters] = acc
        const [fragmentSql, fragmentParameters] = fragment

        return [
            appendTo(accSql) (fragmentSql),
            concat(accParameters, fragmentParameters)
        ]
    }) ([[], []]) (presentFragments)

    return [
        joinWithNewline(sqlArray),
        parameters
    ]
}