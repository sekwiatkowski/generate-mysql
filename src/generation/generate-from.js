import {generateTableAccess} from './access/generate-table-access'

export function generateFrom(useTableAlias) {
    return name => [
        `FROM ${useTableAlias ? generateTableAccess(name, 0) : name}`,
        []
    ]
}