import {joinWithNewline} from 'standard-functions'
import {generateRootBooleanExpression} from './generate-boolean-expression'

export function generateDelete(tableName) {
    return`DELETE FROM ${tableName}`
}

export function generateFilteredDelete(tableName) {
    return predicate => {
        const deleteTable = generateDelete(tableName)

        const [ whereExpression, whereParameters ] = generateRootBooleanExpression(predicate, false)
        const where = `WHERE ${whereExpression}`

        const fragments = [ deleteTable, where ]

        const sql = joinWithNewline(fragments)

        return [sql, whereParameters]
    }
}