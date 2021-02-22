export function set(table, partialObject) {
    return {
        tableIndex: table,
        partialObject,
        kind: 'set'
    }
}