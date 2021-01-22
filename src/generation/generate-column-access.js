import {generateTableAlias} from './generate-table'

export default function generateColumnAccess(expression) {
    const {tableIndex, columnName} = expression

    return `${generateTableAlias(tableIndex)}.${columnName}`
}