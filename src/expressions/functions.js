export function isNull(column) {
    return {
        column,
        kind: 'isnull'
    }
}