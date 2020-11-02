import {generateTableAlias} from './generate_table'

export default function generateColumn({tableIndex, column}) {
    return `${generateTableAlias(tableIndex)}.${column}`
}