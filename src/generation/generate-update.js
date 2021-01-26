import {
    concat,
    flatten,
    joinWithCommaSpace,
    joinWithNewline,
    mapEntries,
    mapKeys,
    propertyOf,
    unzip
} from 'standard-functions'
import {generateEquality} from './generate-comparison'
import {createColumn} from '../expressions/column'
import {generateWhere} from './generate-query'


function generateAssignment([ columnName, value ]) {
    const column = createColumn(0) (columnName)

    return generateEquality(false) ({left: column, right: value})
}

export default function generateUpdate(tableName) {
    return propertyNamesToColumnNames => predicate => partialObject => {
        const partialRow = mapKeys(propertyOf(propertyNamesToColumnNames)) (partialObject)

        const [ generatedAssignments, assignmentParameters ] = unzip(mapEntries(generateAssignment) (partialRow))

        const assignmentList = joinWithCommaSpace(generatedAssignments)

        const updateSql = `UPDATE ${tableName}`
        const setSql = `SET ${assignmentList}`

        const [ whereSql, whereParameters ] = generateWhere(false) (predicate)

        const fragments = [ updateSql, setSql, whereSql ]

        const sql = joinWithNewline(fragments)
        const parameters = concat(flatten(assignmentParameters), whereParameters)

        return [sql, parameters]
    }
}