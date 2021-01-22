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
import {generateTableExpression} from './generate-table'
import {generateEquality} from './generate-comparison'
import {generateRootBooleanExpression} from './generate-boolean-expression'
import {createColumn} from '../expressions/column'


function generateAssignment([ columnName, value ]) {
    const column = createColumn(0) (columnName)

    return generateEquality({ left: column, right: value}, false)
}

export default function generateUpdate(tableName) {
    return propertyNamesToColumnNames => predicate => partialObject => {
        const partialRow = mapKeys(propertyOf(propertyNamesToColumnNames)) (partialObject)

        const [ generatedAssignments, assignmentParameters ] = unzip(mapEntries(generateAssignment) (partialRow))

        const assignmentList = joinWithCommaSpace(generatedAssignments)

        const updateTable = `UPDATE ${generateTableExpression(tableName, 0)}`
        const set = `SET ${assignmentList}`

        const [ whereExpression, whereParameters ] = generateRootBooleanExpression(predicate, false)
        const where = `WHERE ${whereExpression}`

        const fragments = [ updateTable, set, where ]

        const sql = joinWithNewline(fragments)
        const parameters = concat(flatten(assignmentParameters), whereParameters)

        return [sql, parameters]
    }
}