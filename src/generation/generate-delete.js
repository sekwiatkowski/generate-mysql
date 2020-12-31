import {joinWithNewline} from 'standard-functions'
import generateRootPredicate from './generate-predicate'

export function generateDelete(tableName) {
    return`DELETE FROM ${tableName}`
}

export function generateFilteredDelete(tableName) {
    return predicate => {
        const deleteTable = generateDelete(tableName)

        const [ whereExpression, whereParameters ] = generateRootPredicate(predicate, false)
        const where = `WHERE ${whereExpression}`

        const fragments = [ deleteTable, where ]

        const sql = joinWithNewline(fragments)

        return [sql, whereParameters]
    }
}