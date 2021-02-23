import generateColumnAccess from '../access/generate-column-access'
import {generateListOfValues} from '../generate-value'
import {concat} from 'standard-functions'

export function generateIn(useAlias) {
    return ({ column, set }) => {
        const [accessSql, accessParameters] = generateColumnAccess(useAlias) (column)
        const [listSql, listParameters] = generateListOfValues(set)

        return [`${accessSql} IN (${listSql})`, concat(accessParameters, listParameters)]
    }

}