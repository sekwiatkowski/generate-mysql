import {generateTableAccess} from './access/generate-table-access'

export function generateFrom(useAlias) {
    return name => [
        `FROM ${useAlias ? generateTableAccess(name, 0) : name}`,
        []
    ]
}