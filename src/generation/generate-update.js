import {
    concat,
    flatten,
    joinWithCommaSpace,
    joinWithNewline,
    map,
    mapEntries,
    mapKeys,
    propertyOf,
    unzip
} from 'compose-functions'
import {generateTableExpression} from './generate-table'
import generateComparison from './generate-comparison'
import createValue from '../expressions/value'
import {createEquality} from '../expressions/predicate'
import createColumn from '../expressions/column'

export default function generateUpdate(tableName) {
    return propertyNamesToColumnNames => comparison => partialObject => {
        const partialRow = mapKeys(propertyOf(propertyNamesToColumnNames)) (partialObject)

        const assignments = mapEntries(([name, value]) => {
            const columnExpression = createColumn(0)(name)
            const valueExpression = createValue(value)

            return createEquality(columnExpression) (valueExpression)
        }) (partialRow)

        const [ generatedAssignments, assignmentParameters ] = unzip(map(generateComparison) (assignments))

        const assignmentList = joinWithCommaSpace(generatedAssignments)

        const updateTable = `UPDATE ${generateTableExpression(tableName, 0)}`
        const set = `SET ${assignmentList}`

        const [ whereExpression, whereParameters ] = generateComparison(comparison)
        const where = `WHERE ${whereExpression}`

        const fragments = [ updateTable, set, where ]

        const sql = joinWithNewline(fragments)
        const parameters = concat([ flatten(assignmentParameters), whereParameters ])

        return [sql, parameters]
    }
}