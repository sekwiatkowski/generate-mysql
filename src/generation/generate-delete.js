import {joinWithNewline} from 'standard-functions'
import generateComparison from './generate-comparison'

export function generateDelete(tableName) {
    return`DELETE FROM ${tableName}`
}

export function generateFilteredDelete(tableName) {
    return comparison => {
        const deleteTable = generateDelete(tableName)

        const [ whereExpression, whereParameters ] = generateComparison(comparison, false)
        const where = `WHERE ${whereExpression}`

        const fragments = [ deleteTable, where ]

        const sql = joinWithNewline(fragments)

        return [sql, whereParameters]
    }
}