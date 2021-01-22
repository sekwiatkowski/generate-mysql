import generateColumnAccess from './generate-column-access'

export function generateIsNull(expression) {
    const columnAccess = generateColumnAccess(expression.column)
    return `ISNULL(${columnAccess})`
}