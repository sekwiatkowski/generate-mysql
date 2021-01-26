import {joinWithNewline} from 'standard-functions'
import {generateWhere} from './generate-query'

export function generateDelete(tableName) {
    return [`DELETE FROM ${tableName}`, []]
}

export function generateFilteredDelete(tableName) {
    return predicate => {
        const [ deleteSql, _ ] = generateDelete(tableName)

        const [ whereSql, whereParameters ] = generateWhere(false) (predicate)

        const fragments = [ deleteSql, whereSql ]

        const sql = joinWithNewline(fragments)

        return [sql, whereParameters]
    }
}