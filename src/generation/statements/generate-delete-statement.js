import {concat, joinWithNewline} from 'standard-functions'
import {generateWhere} from '../generate-where'
import {generateFrom} from '../generate-from'

export function generateDeleteStatement(tableName) {
    const [fromSql, fromParameters] = generateFrom(false) (tableName)

    return [`DELETE ${fromSql}`, fromParameters]
}

export function generateFilteredDeleteStatement(tableName) {
    return predicate => {
        const [ deleteSql, deleteParameters ] = generateDeleteStatement(tableName)

        const [ whereSql, whereParameters ] = generateWhere(false) (predicate)

        const sql = joinWithNewline(deleteSql, whereSql)
        const parameters = concat(deleteParameters, whereParameters)

        return [sql, parameters]
    }
}