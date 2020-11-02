import {generateTableAlias} from './generate-table'

export default function generateColumn({tableIndex, column}) {
    return `${generateTableAlias(tableIndex)}.${column}`
}