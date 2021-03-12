export function set(table, assignment) {
    return {
        tableIndex: table,
        assignment,
        kind: 'set'
    }
}