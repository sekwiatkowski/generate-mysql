import {joinWithNewline} from 'standard-functions'
import {generateWhere} from './generate-select-statement'

export function generateDeleteStatement(tableName) {
    return [`DELETE FROM ${tableName}`, []]
}

export function generateFilteredDelete(tableName) {
    return predicate => {
        const [ deleteSql, _ ] = generateDeleteStatement(tableName)

        const [ whereSql, whereParameters ] = generateWhere(false) (predicate)

        const fragments = [ deleteSql, whereSql ]

        const sql = joinWithNewline(fragments)

        return [sql, whereParameters]
    }
}