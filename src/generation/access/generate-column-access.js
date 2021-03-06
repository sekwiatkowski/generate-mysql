import {generateTableAlias} from './generate-table-access'

export default function generateColumnAccess(useAlias) {
    return expression => {
        const {tableIndex, columnName} = expression

        if (useAlias) {
            return [`${generateTableAlias(tableIndex)}.${columnName}`, []]
        }
        else {
            return [columnName, []]
        }
    }
}